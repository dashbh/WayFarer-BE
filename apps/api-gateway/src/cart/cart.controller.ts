import {
  Controller,
  Inject,
  Get,
  Param,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/auth.guard';
import { lastValueFrom, Observable } from 'rxjs';
import {
  CartResponseDto,
} from '@wayfarer/common';

interface CartGrpcService {
  getCart(data: {}): Observable<CartResponseDto>;
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

  @Get() // POST /cart - General cart request
  @UseGuards(JwtAuthGuard)
  async getCart() {
    return await lastValueFrom(this.cartService.getCart({}));
  }
}
