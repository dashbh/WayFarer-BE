import {
  Controller,
  Inject,
  Get,
  UseGuards,
  InternalServerErrorException,
  Post,
  Req,
  Body,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AddItemDto, CartResponseDto } from '@wayfarer/common';
import { Metadata } from '@grpc/grpc-js';

import { JwtAuthGuard } from '../auth/auth.guard';

interface CartGrpcService {
  GetCart(
    data: Record<string, unknown>,
    metadata?: Metadata,
  ): Observable<CartResponseDto>;
  AddToCart(data: AddItemDto, metadata?: Metadata): Promise<any>;
  RemoveItemFromCart(data: AddItemDto, metadata?: Metadata): Promise<any>;
  ClearCart(data: any, metadata?: Metadata): Promise<any>;
  Checkout(data: any, metadata?: Metadata): Promise<any>;
}

@Controller('cart')
export class CartController {
  private cartService: CartGrpcService;

  constructor(@Inject('CART_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.cartService =
      this.client.getService<CartGrpcService>('CartGrpcService');
    if (!this.cartService) {
      throw new InternalServerErrorException(
        'AuthGrpcService not initialized properly',
      );
    }
  }

  @Get() // GET /cart - General cart request
  @UseGuards(JwtAuthGuard)
  async getCart(@Req() req: Request) {
    const metadata = new Metadata();
    const token = req.cookies?.auth_token;
    metadata.add('authorization', `Bearer ${token}`);
    return this.cartService.GetCart({}, metadata);
  }

  @Post() // POST /cart - AddToCart request
  @UseGuards(JwtAuthGuard)
  async addToCart(@Req() req: Request, @Body() item: AddItemDto) {
    const metadata = new Metadata();
    const token = req.cookies?.auth_token;
    metadata.add('authorization', `Bearer ${token}`);
    return this.cartService.AddToCart(item, metadata);
  }

  @Post('remove') // POST /cart/remove - Remove item from cart
  @UseGuards(JwtAuthGuard)
  async removeItemFromCart(@Req() req: Request, @Body() item: AddItemDto) {
    const metadata = new Metadata();
    const token = req.cookies?.auth_token;
    metadata.add('authorization', `Bearer ${token}`);
    if (!this.cartService['RemoveItemFromCart']) {
      throw new InternalServerErrorException(
        'RemoveItemFromCart not implemented in CartGrpcService',
      );
    }
    return this.cartService.RemoveItemFromCart(item, metadata);
  }

  @Delete() // DELETE /cart - Remove item from cart
  @UseGuards(JwtAuthGuard)
  async clearCart(@Req() req: Request) {
    const metadata = new Metadata();
    const token = req.cookies?.auth_token;
    metadata.add('authorization', `Bearer ${token}`);
    if (!this.cartService['ClearCart']) {
      throw new InternalServerErrorException(
        'ClearCart not implemented in CartGrpcService',
      );
    }
    return this.cartService.ClearCart({}, metadata);
  }

  @Post('checkout') // POST /cart/checkout - Placing Order
  @UseGuards(JwtAuthGuard)
  async checkout(@Req() req: Request) {
    const metadata = new Metadata();
    const token = req.cookies?.auth_token;
    metadata.add('authorization', `Bearer ${token}`);
    return this.cartService.Checkout({}, metadata);
  }
}
