import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  getCart() {
    return [
      { id: '1', name: 'Item 1', description: 'Description of Item 1', price: 20 },
      { id: '2', name: 'Item 2', description: 'Description of Item 2', price: 125 },
    ];
  }
}
