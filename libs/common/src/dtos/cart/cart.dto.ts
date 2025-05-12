export class CartItemDto {
  productId: string;
  quantity: number;
  title?: string;
  price?: number;
  imageUrl?: string;
  discountPrice?: number;
  currency?: string;
  brand?: string;
}

export class CartResponseDto {
  items: CartItemDto[];
}
