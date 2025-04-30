import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { HttpResponse } from '@wayfarer/common';

describe('CartController', () => {
  let cartController: CartController;
  let cartServiceMock: CartService;

  beforeEach(async () => {
    cartServiceMock = {
      getCart: jest.fn(),
      getCartItem: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [{ provide: CartService, useValue: cartServiceMock }],
    }).compile();

    cartController = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(cartController).toBeDefined();
  });

  describe('getCart', () => {
    it('should return a success response with cart list', async () => {
      const mockCartList = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ];

      (cartServiceMock.getCart as jest.Mock).mockReturnValue(mockCartList);

      const result = cartController.getCart();

      expect(cartServiceMock.getCart).toHaveBeenCalled();
      expect(result).toEqual(HttpResponse.success(mockCartList, 'Success'));
    });
  });
});
