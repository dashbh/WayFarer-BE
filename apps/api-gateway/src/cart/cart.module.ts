import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CART_PROTO_PATH } from '@wayfarer/common';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'CART_PACKAGE',
        imports: [ConfigModule], // Ensure ConfigModule is available
        inject: [ConfigService], // Inject ConfigService
        useFactory: (configService: ConfigService) => {
          const host = configService.get<string>(
            'CART_SERVICE_HOST',
            'localhost',
          );
          const port = configService.get<number>('CART_SERVICE_PORT', 9003);
          return {
            transport: Transport.GRPC,
            options: {
              package: 'wayfarer.cart',
              protoPath: CART_PROTO_PATH,
              url: `${host}:${port}`,
            },
          };
        },
      },
    ]),
  ],
  controllers: [CartController],
  providers: [],
})
export class CartModule {}
