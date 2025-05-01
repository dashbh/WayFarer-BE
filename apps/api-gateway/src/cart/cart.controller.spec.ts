import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

import { CartController } from './cart.controller';
import { JwtAuthGuard } from '../auth/auth.guard';

describe('CartController', () => {
  let cartController: CartController;
  let cartClientMock: ClientProxy;

  beforeEach(async () => {
    cartClientMock = {
      send: jest.fn(() => of({ success: true })), // Mock send method
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: 'CART_SERVICE',
          useValue: cartClientMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Bypass JWT guard for unit testing
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    cartController = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(cartController).toBeDefined();
  });

  it('should call cartClient.send() on getCart', async () => {
    await cartController.getCart();

    expect(cartClientMock.send).toHaveBeenCalledWith({ cmd: 'cart' });
  });
});
