import {
  Controller,
  Inject,
  Get,
  UseGuards,
  InternalServerErrorException,
  Req,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { OrderItemDto, OrderListResponseDto } from '@wayfarer/common';
import { Metadata } from '@grpc/grpc-js';

import { JwtAuthGuard } from '../auth/auth.guard';

interface CartGrpcService {
  GetOrderList(
    data: Record<string, unknown>,
    metadata?: Metadata,
  ): Observable<OrderListResponseDto>;
  GetOrderById(id: string, metadata?: Metadata): Observable<OrderItemDto>;
}

@Controller('order')
export class OrderController {
  private cartService: CartGrpcService;

  constructor(@Inject('CART_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.cartService =
      this.client.getService<CartGrpcService>('CartGrpcService');
    if (!this.cartService) {
      throw new InternalServerErrorException(
        'CartGrpcService not initialized properly',
      );
    }
  }

  @Get() // GET /order - General order list request
  @UseGuards(JwtAuthGuard)
  async getOrder(@Req() req: Request) {
    const metadata = new Metadata();
    const token = req.cookies?.auth_token;
    metadata.add('authorization', `Bearer ${token}`);
    return this.cartService.GetOrderList({}, metadata);
  }

  @Get(':id') // GET /order/:id - This will get a specific order item by id
  @UseGuards(JwtAuthGuard)
  async getOrderItem(@Req() req: Request, @Param('id') id: string) {
    const metadata = new Metadata();
    const token = req.cookies?.auth_token;
    metadata.add('authorization', `Bearer ${token}`);
    return this.cartService.GetOrderById(id, metadata);
  }
}
