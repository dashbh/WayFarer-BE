import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let authClientMock: ClientProxy;

  beforeEach(async () => {
    authClientMock = {
      send: jest.fn(() => of({ success: true })), // Mock send method
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'AUTH_SERVICE',
          useValue: authClientMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should call authClient.send() on login', async () => {
    const data = { usename: 'test@example.com', password: '123456' };
    await authController.login(data);

    expect(authClientMock.send).toHaveBeenCalledWith({ cmd: 'login' }, data);
  });

  it('should call authClient.send() on register', async () => {
    const data = { usename: 'newuser@example.com', password: 'password123' };
    await authController.register(data);

    expect(authClientMock.send).toHaveBeenCalledWith(
      { cmd: 'register_user' },
      data,
    );
  });
});
