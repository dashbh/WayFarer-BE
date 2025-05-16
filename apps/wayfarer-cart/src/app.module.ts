import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDatabaseModule } from '@wayfarer/framework';

import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoDatabaseModule,
    CartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
