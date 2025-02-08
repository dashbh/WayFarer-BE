import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const configService = app.get(ConfigService);

  const host = configService.get<string>('API_GATEWAY_HOST', 'localhost'); // Default to 0.0.0.0 for Docker
  const port = configService.get<number>('API_GATEWAY_PORT', 3000); // Default port 3000

  await app.startAllMicroservices();
  await app.listen(port, host);
  console.log(`✅ WayFarer API Gateway is running on http://${host}:${port}`);
}
bootstrap();
