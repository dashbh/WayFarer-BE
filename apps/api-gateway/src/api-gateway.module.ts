import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from './auth/jwt-auth.module';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtAuthModule,
    AuthModule,
    CatalogModule,
    CartModule
  ],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
