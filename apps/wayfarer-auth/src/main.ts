import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const appContext = await NestFactory.create(AuthModule);
  const configService = appContext.get(ConfigService);

  const host = configService.get<string>('AUTH_SERVICE_HOST', 'localhost');
  const port = configService.get<number>('AUTH_SERVICE_PORT', 9001);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: { host, port },
    },
  );

  await app.listen();
  console.log(`✅ WayFarer Auth Service is running on TCP ${host}:${port}`);
}
bootstrap();
