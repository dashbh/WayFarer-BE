import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CartModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
