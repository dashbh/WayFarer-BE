import { Controller, UseGuards, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { AddItemDto, CartResponseDto } from '@wayfarer/common';
import { status as GrpcStatus } from '@grpc/grpc-js';

import { CartService } from './cart.service';
import { GrpcAuthGuard } from '../guards/grpc-auth.guard';

@UseGuards(GrpcAuthGuard)
@Controller()
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private readonly cartService: CartService) {}

  private getUserIdFromContext(context: any): string {
    try {
      const user = JSON.parse(context.get('user')).id;
      return user;
    } catch (error) {
      this.logger.error(`Error parsing user from context: ${error.message}`);
      throw new RpcException({
        code: GrpcStatus.UNAUTHENTICATED,
        message: 'Invalid user data in context',
      });
    }
  }

  @GrpcMethod('wayfarer.cart.CartGrpcService', 'GetCart')
  async getCart(_: any, context: any): Promise<CartResponseDto> {
    const userId = this.getUserIdFromContext(context);
    if (!userId) {
      throw new RpcException({
        code: GrpcStatus.UNAUTHENTICATED,
        message: `No user ID found in context ${userId}`,
      });
    }

    try {
      const cartObject = await this.cartService.getCartByUserId(userId);
      this.logger.log(
        `Cart cartObject for user ${userId}: ${JSON.stringify(cartObject)}`,
      );
      return cartObject;
    } catch (error) {
      this.logger.error(
        `Error fetching cart for user ${userId}: ${error.message}`,
      );
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: 'Cart list not found',
      });
    }
  }

  @GrpcMethod('wayfarer.cart.CartGrpcService', 'AddToCart')
  async addToCart(data: AddItemDto, context: any): Promise<any> {
    const userId = this.getUserIdFromContext(context);
    try {
      this.cartService.addItemToCart(userId, data);
      this.logger.log(
        `Added item to cart for user ${userId}: ${JSON.stringify(data)}`,
      );
      return { message: 'Item added' };
    } catch (error) {
      this.logger.error(
        `Error Added item to cart for user ${userId}: ${error.message}`,
      );
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: 'Unable to add item',
      });
    }
  }

  @GrpcMethod('wayfarer.cart.CartGrpcService', 'RemoveItemFromCart')
  async removeItemFromCart(data: AddItemDto, context: any): Promise<any> {
    const userId = this.getUserIdFromContext(context);
    try {
      this.cartService.removeItemFromCart(userId, data?.productId);
      this.logger.log(
        `Removed item from cart for user ${userId}: ${JSON.stringify(data)}`,
      );
      return { message: 'Item Removed' };
    } catch (error) {
      this.logger.error(
        `Error removing item from cart for user ${userId}: ${error.message}`,
      );
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: 'Unable to remove item',
      });
    }
  }

  @GrpcMethod('wayfarer.cart.CartGrpcService', 'ClearCart')
  async clearCart(_: any, context: any): Promise<any> {
    const userId = this.getUserIdFromContext(context);
    try {
      this.cartService.clearCart(userId);
      this.logger.log(`Deleted cart for user ${userId}`);
      return { message: 'Cart deleted' };
    } catch (error) {
      this.logger.error(
        `Error clearing cart for user ${userId}: ${error.message}`,
      );
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: 'Cart list not found',
      });
    }
  }

  @GrpcMethod('wayfarer.cart.CartGrpcService', 'Checkout')
  async checkout(_: any, context: any): Promise<any> {
    const userId = this.getUserIdFromContext(context);
    try {
      const items = this.cartService.checkout(userId);
      this.logger.log(
        `Checked out items for user ${userId}: ${JSON.stringify(items)}`,
      );
      return { message: 'Checked out', items };
    } catch (error) {
      this.logger.error(
        `Error checking out for user ${userId}: ${error.message}`,
      );
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: 'Cart list not found',
      });
    }
  }
}
