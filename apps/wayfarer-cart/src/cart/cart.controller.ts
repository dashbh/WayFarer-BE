import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { CartService } from './cart.service';
import {
  CartResponseDto,
} from '@wayfarer/common';
import { status as GrpcStatus } from '@grpc/grpc-js';

@Controller()
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private readonly cartService: CartService) {}

  @GrpcMethod('wayfarer.cart.CartGrpcService', 'GetCart')
  async getCart(): Promise<CartResponseDto> {
    const items = await this.cartService.getCart();
    if (!items) {
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: 'Cart list not found',
      });
    }

    return { items };
  }
}
