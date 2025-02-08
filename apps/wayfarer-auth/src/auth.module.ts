import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load env variables globally
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
