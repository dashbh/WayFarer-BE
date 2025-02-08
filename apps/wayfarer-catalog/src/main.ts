import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { CatalogModule } from './catalog.module';

async function bootstrap() {
  const appContext = await NestFactory.create(CatalogModule); // Create app context
  const configService = appContext.get(ConfigService); // Retrieve ConfigService

  const host = configService.get<string>('CATALOG_SERVICE_HOST', 'localhost');
  const port = configService.get<number>('CATALOG_SERVICE_PORT', 3002);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
    {
      transport: Transport.TCP,
      options: { host, port },
    },
  );

  await app.listen();
  console.log(`✅ WayFarer Catalog Service is running on TCP ${host}:${port}`);
}
bootstrap();
