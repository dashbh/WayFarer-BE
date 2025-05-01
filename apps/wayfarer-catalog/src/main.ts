import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { CATALOG_PROTO_PATH, HttpExceptionFilter } from '@wayfarer/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const appContext = await NestFactory.create(AppModule);
  const configService = appContext.get(ConfigService);

  const host = configService.get<string>('CATALOG_SERVICE_HOST', 'localhost');
  const port = configService.get<number>('CATALOG_SERVICE_PORT', 9002);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'wayfarer.catalog',
        protoPath: CATALOG_PROTO_PATH,
        url: `${host}:${port}`,
      },
    },
  );
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen();
  console.log(`✅ WayFarer Catalog Service is running on TCP ${host}:${port}`);
}
bootstrap();
