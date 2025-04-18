export class CartItemDto {
  id: string;
  name: string;
  description: string;
  price: number;
}

export class CartResponseDto {
  items: CartItemDto[];
}
