import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { CART_PROTO_PATH, HttpExceptionFilter } from '@wayfarer/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const appContext = await NestFactory.create(AppModule);
  const configService = appContext.get(ConfigService);

  const host = configService.get<string>('CART_SERVICE_HOST', 'localhost');
  const port = configService.get<number>('CART_SERVICE_PORT', 9003);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'wayfarer.cart',
        protoPath: CART_PROTO_PATH,
        url: `${host}:${port}`,
      },
    },
  );
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen();
  console.log(`✅ WayFarer Cart Service is running on TCP ${host}:${port}`);
}
bootstrap();
