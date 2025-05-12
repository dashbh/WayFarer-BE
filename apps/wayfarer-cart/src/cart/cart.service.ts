import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AddItemDto,
  CartItemDto,
  CatalogItemRequestDto,
  CatalogItemResponseDto,
} from '@wayfarer/common';
import { firstValueFrom, Observable } from 'rxjs';

interface CatalogGrpcService {
  getCatalogItem(
    data: CatalogItemRequestDto,
  ): Observable<CatalogItemResponseDto>;
}

@Injectable()
export class CartService {
  constructor(
    @Inject('CATALOG_PACKAGE') private readonly catalogClient: ClientGrpc,
  ) {}

  private carts: Map<string, CartItemDto[]> = new Map();
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

  async getCart(userId: string): Promise<CartItemDto[]> {
    return await this.getCartWithProductDetails(userId);
  }

  addItem(userId: string, item: AddItemDto): void {
    const cart = this.carts.get(userId) || [];
    const existing = cart.find((i: any) => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push({ ...item });
    }
    this.carts.set(userId, cart);
  }

  async checkout(userId: string): Promise<CartItemDto[]> {
    const items = await this.getCart(userId);
    this.carts.delete(userId);
    return items;
  }

  async getCartWithProductDetails(userId: string) {
    const cart = this.carts.get(userId) || [];
    const enrichedItems = await Promise.all(
      cart.map(async (item) => {
        const response = await firstValueFrom(
          this.catalogService.getCatalogItem({ id: item.productId }),
        );

        const product = response.item;

        return {
          ...item,
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl,
        };
      }),
    );

    return enrichedItems;
  }
}
