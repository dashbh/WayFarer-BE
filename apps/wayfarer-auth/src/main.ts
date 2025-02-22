import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
// import { HttpExceptionFilter } from '@wayfarer/common';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const appContext = await NestFactory.create(AuthModule); // Create app context
  const configService = appContext.get(ConfigService); // Retrieve ConfigService

  const host = configService.get<string>('AUTH_SERVICE_HOST', 'localhost');
  const port = configService.get<number>('AUTH_SERVICE_PORT', 9001);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: { host, port },
    },
  );

  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen();
  console.log(`✅ WayFarer Auth Service is running on TCP ${host}:${port}`);
}
bootstrap();
