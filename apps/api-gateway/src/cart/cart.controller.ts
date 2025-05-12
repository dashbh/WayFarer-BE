import {
  Controller,
  Inject,
  Get,
  UseGuards,
  InternalServerErrorException,
  Post,
  Req,
  Body,
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

  @Post() // POST /cart - General cart request
  @UseGuards(JwtAuthGuard)
  async addToCart(@Req() req: Request, @Body() item: AddItemDto) {
    const metadata = new Metadata();
    const token = req.cookies?.auth_token;
    metadata.add('authorization', `Bearer ${token}`);
    return this.cartService.AddToCart(item, metadata);
  }

  @Post('checkout') // POST /checkout - Placing Order
  @UseGuards(JwtAuthGuard)
  async checkout(@Req() req: Request) {
    const metadata = new Metadata();
    const token = req.cookies?.auth_token;
    metadata.add('authorization', `Bearer ${token}`);
    return this.cartService.Checkout({}, metadata);
  }
}
