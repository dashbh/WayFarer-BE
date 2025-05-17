import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

import { OrderController } from './order.controller';
import { JwtAuthGuard } from '../auth/auth.guard';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderClientMock: ClientProxy;

  beforeEach(async () => {
    orderClientMock = {
      send: jest.fn(() => of({ success: true })), // Mock send method
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: 'CART_SERVICE',
          useValue: orderClientMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Bypass JWT guard for unit testing
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    orderController = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(orderController).toBeDefined();
  });
});
