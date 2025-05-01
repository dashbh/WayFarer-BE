import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load env variables globally
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
