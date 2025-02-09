import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const configService = app.get(ConfigService);

  const host = configService.get<string>('API_GATEWAY_HOST', 'localhost');
  const port = configService.get<number>('API_GATEWAY_PORT', 9000);

  await app.startAllMicroservices();
  await app.listen(port, host);
  console.log(`✅ WayFarer API Gateway is running on http://${host}:${port}`);
}
bootstrap();
