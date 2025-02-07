import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  await app.startAllMicroservices();
  await app.listen(3000, '0.0.0.0');
  console.log('API Gateway is running on http://localhost:3000');
}
bootstrap();