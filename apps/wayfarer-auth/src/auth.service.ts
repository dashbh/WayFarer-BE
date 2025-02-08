import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login({ username, password }: { username: string; password: string }) {
    if (username === 'admin' && password === 'password') {
      return { token: 'login-success -> mock-jwt-token' };
    }
    return { error: 'Invalid credentials' };
  }
}
