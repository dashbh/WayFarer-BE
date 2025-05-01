import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
// import { KafkaModule } from '@wayfarer/framework';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // KafkaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
