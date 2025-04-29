import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from './auth/jwt-auth.module';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';
import { HealthModule } from './health/health.module';
import { KafkaModule } from '@wayfarer/framework';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtAuthModule,
    HealthModule,
    AuthModule,
    CatalogModule,
    CartModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
