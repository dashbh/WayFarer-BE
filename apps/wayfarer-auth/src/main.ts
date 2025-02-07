import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WayfarerAuthModule } from './wayfarer-auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WayfarerAuthModule,
    {
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3002 },
    },
  );

  await app.listen();
  console.log('WayFarer Auth Service is running on TCP port 3002');
}
bootstrap();
