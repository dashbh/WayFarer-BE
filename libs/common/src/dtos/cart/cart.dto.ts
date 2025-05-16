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
  cartId: string;
  items: CartItemDto[];
  total?: number;
  subTotal?: number;
  taxes?: number;
  currency?: string;
  totalDiscount?: number;
  itemCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
