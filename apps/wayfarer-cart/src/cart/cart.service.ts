import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import {
  AccessoryDto,
  AddItemDto,
  CartItemDto,
  CartMongo,
  CartMongoDocument,
  CartResponseDto,
  CatalogItemRequestDto,
  OrderItemDto,
  OrderListResponseDto,
  OrderMongo,
  OrderMongoDocument,
} from '@wayfarer/common';
import { Model } from 'mongoose';
import { firstValueFrom, Observable } from 'rxjs';

interface CatalogGrpcService {
  getCatalogItem(
    data: CatalogItemRequestDto,
  ): Observable<{ item: AccessoryDto }>;
}

@Injectable()
export class CartService {
  constructor(
    @Inject('CATALOG_PACKAGE') private readonly catalogClient: ClientGrpc,
    @InjectModel(CartMongo.name)
    private readonly cartModel: Model<CartMongoDocument>,

    @InjectModel(OrderMongo.name)
    private readonly orderModel: Model<OrderMongoDocument>,
  ) {}

  private catalogService: CatalogGrpcService;

  onModuleInit() {
    this.catalogService =
      this.catalogClient.getService<CatalogGrpcService>('CatalogGrpcService');
    if (!this.catalogService) {
      throw new InternalServerErrorException(
        'CatalogGrpcService not initialized properly',
      );
    }
  }

  async getCartByUserId(userId: string): Promise<CartResponseDto> {
    const cart = await this.cartModel.findOne({ userId }).exec();

    if (!cart) {
      throw new NotFoundException('Cart not found for user');
    }

    // Map Mongoose document to CartResponseDto
    const cartDto: CartResponseDto = {
      ...this.mapCartResponseToDto(cart),
    };

    // Enrich cart with real time catalog data
    const enrichedCart = await this.enrichCartwithCatalogItems(cartDto);

    // Calculate cart totals
    const cartWithTotals = this.calculateCartTotals(enrichedCart);

    return {
      ...cartWithTotals,
    };
  }

  async addItemToCart(userId: string, item: AddItemDto): Promise<void> {
    let cart = await this.cartModel.findOne({ userId });

    if (cart) {
      // Check if item already exists in cart
      const existingItem = cart.items.find(
        (cartItem: any) => cartItem.productId === item.productId,
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        cart.items.push({ ...item });
      }
    } else {
      // Create a new cart document for the user
      cart = new this.cartModel({
        userId,
        items: [{ ...item }],
      });
    }
    await cart.save();
  }

  async removeItemFromCart(userId: string, productId: string): Promise<void> {
    const cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundException('Cart not found for user');
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item: any) => item.productId !== productId);

    if (cart.items.length === initialLength) {
      throw new NotFoundException(
        `Item not found in cart ${userId}-${productId}`,
      );
    }

    if (cart.items.length === 0) {
      await cart.deleteOne();
    } else {
      await cart.save();
    }
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundException('Cart not found for user');
    }

    await cart.deleteOne();
  }

  async checkout(userId: string, data: any): Promise<OrderItemDto> {
    const cart = await this.getCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found for user');
    }

    const orderObject: OrderItemDto = {
      ...cart,
      orderStatus: 'Pending',
      shippingAddress: data?.shippingAddress,
      shippingType: data?.shippingType,
      paymentStatus: 'Pending',
      paymentType: data?.paymentType,
    };

    const order = new this.orderModel({
      userId,
      ...orderObject,
    });

    const orderResponse = await order.save();

    return {
      ...this.mapOrderToDto(orderResponse),
    };
  }

  async getOrderListByUserId(userId: string): Promise<OrderListResponseDto> {
    const orderList = await this.orderModel.find({ userId }).exec();

    if (!orderList && !Array.isArray(orderList)) {
      throw new NotFoundException('Order list found for user');
    }

    const mappedOrderList = orderList.map((item) => this.mapOrderToDto(item));

    return {
      data: mappedOrderList,
    };
  }

  async getOrderItem(userId: string, orderId: string): Promise<any> {
    const orderItem = await this.orderModel.findOne({ userId, id: orderId });

    if (!orderItem) {
      throw new NotFoundException('Order not found for user');
    }

    return {
      ...this.mapOrderToDto(orderItem),
    };
  }

  async enrichCartwithCatalogItems(cart: CartResponseDto) {
    const enrichedItems = await Promise.all(
      cart.items.map(async (item) => {
        const response = await firstValueFrom(
          this.catalogService.getCatalogItem({ id: item.productId }),
        );

        // Dynamically extract the first property value from the "item" object
        if (response && response.item && typeof response.item === 'object') {
          const firstKey = Object.keys(response.item)[0];
          if (firstKey) {
            response.item = response.item[firstKey];
          }
        }
        const product: AccessoryDto = response.item;
        return {
          ...item,
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl,
          discountPrice: product?.discountPrice,
          currency: product.currency,
          brand: product.brand,
        };
      }),
    );

    return { ...cart, items: enrichedItems };
  }

  /**
   * Calculates subtotal, total, and item count for the cart.
   * Adds: subtotal, total, itemCount fields to the returned cart object.
   * Assumes each item has price, discountPrice (optional), and quantity.
   */
  calculateCartTotals(cart: CartResponseDto) {
    let subTotal = 0;
    let total = 0;
    let itemCount = 0;
    let totalDiscount = 0;

    const TAX_RATE = 0.18; // 18% GST, adjust as needed

    const items = cart.items.map((item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const discountPrice =
        typeof item.discountPrice === 'number' ? item.discountPrice : price;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1;

      subTotal += price * quantity;
      total += discountPrice * quantity;
      itemCount += quantity;
      totalDiscount += (price - discountPrice) * quantity;

      return item;
    });

    const taxes = Number((total * TAX_RATE).toFixed(2));
    // Add tax to total
    total += taxes;

    return {
      ...cart,
      items: cart.items,
      subTotal: Number(subTotal.toFixed(2)),
      total: Number(total.toFixed(2)),
      itemCount,
      totalDiscount: Number(totalDiscount.toFixed(2)),
      taxes,
      currency: items[0]?.currency || '₹',
    };
  }

  // Utils
  private mapCartItemToDto(item: any): CartItemDto {
    return {
      productId: item.productId,
      quantity: item.quantity,
      title: item.title,
      price: item.price,
      imageUrl: item.imageUrl,
      discountPrice: item.discountPrice,
      currency: item.currency,
      brand: item.brand,
    };
  }

  private mapCartResponseToDto(cart: any): CartResponseDto {
    return {
      cartId: cart.id,
      items: cart.items.map((item: any) => this.mapCartItemToDto(item)),
      total: cart.total,
      subTotal: cart.subTotal,
      taxes: cart.taxes,
      currency: cart.currency,
      totalDiscount: cart.totalDiscount,
      itemCount: cart.itemCount,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  private mapOrderToDto(order: any): OrderItemDto {
    return {
      orderId: order.id,
      cartId: order.cartId,
      items: order.items.map((item: any) => this.mapCartItemToDto(item)),
      total: order.total,
      subTotal: order.subTotal,
      taxes: order.taxes,
      currency: order.currency,
      totalDiscount: order.totalDiscount,
      itemCount: order.itemCount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderStatus: order.orderStatus,
      shippingAddress: order.shippingAddress,
      shippingType: order.shippingType,
      paymentStatus: order.paymentStatus,
      paymentType: order.paymentType,
    };
  }
}
