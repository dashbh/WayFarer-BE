import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
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
        protoPath: join(process.cwd(), 'apps/api-gateway/src/proto/auth.proto'),
        url: `${host}:${port}`,
      },
    },
  );

  await app.listen();
  console.log(`✅ WayFarer Auth Service is running on TCP ${host}:${port}`);
}
bootstrap();
