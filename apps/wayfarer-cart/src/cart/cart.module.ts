import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CartMongo,
  CartMongoSchema,
  CATALOG_PROTO_PATH,
} from '@wayfarer/common';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { GrpcAuthGuard } from '../guards/grpc-auth.guard';

@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true }), // Load env variables globally
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'CATALOG_PACKAGE',
        imports: [ConfigModule], // Ensure ConfigModule is available
        inject: [ConfigService], // Inject ConfigService
        useFactory: (configService: ConfigService) => {
          const host = configService.get<string>(
            'CATALOG_GRPC_HOST',
            'localhost',
          );
          const port = configService.get<number>('CATALOG_SERVICE_PORT', 9002);
          return {
            transport: Transport.GRPC,
            options: {
              package: 'wayfarer.catalog',
              protoPath: CATALOG_PROTO_PATH,
              url: `${host}:${port}`,
            },
          };
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: CartMongo.name, schema: CartMongoSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService, GrpcAuthGuard],
})
export class CartModule {}
