import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { WayfarerAuthModule } from './wayfarer-auth.module';

async function bootstrap() {
  const appContext = await NestFactory.create(WayfarerAuthModule); // Create app context
  const configService = appContext.get(ConfigService); // Retrieve ConfigService

  const host = configService.get<string>('AUTH_SERVICE_HOST', 'localhost');
  const port = configService.get<number>('AUTH_SERVICE_PORT', 3001);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WayfarerAuthModule,
    {
      transport: Transport.TCP,
      options: { host, port },
    },
  );

  await app.listen();
  console.log(`✅ WayFarer Auth Service is running on TCP ${host}:${port}`);
}
bootstrap();
