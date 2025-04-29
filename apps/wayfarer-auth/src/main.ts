import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AUTH_PROTO_PATH, HttpExceptionFilter } from '@wayfarer/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const appContext = await NestFactory.create(AppModule);
  const configService = appContext.get(ConfigService);

  const host = configService.get<string>('AUTH_SERVICE_HOST', 'localhost');
  const port = configService.get<number>('AUTH_SERVICE_PORT', 9001);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'wayfarer.auth',
        protoPath: AUTH_PROTO_PATH,
        url: `${host}:${port}`,
      },
    }
  );
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen();
  console.log(`✅ WayFarer Auth Service is running on TCP ${host}:${port}`);
}
bootstrap();
