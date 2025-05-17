import { CartResponseDto } from './cart.dto';

export class OrderItemDto extends CartResponseDto {
  orderId?: string;
  orderStatus: string;
  shippingAddress: string;
  shippingType: string;
  paymentStatus: string;
  paymentType: string;
}

export class OrderListResponseDto {
  data: OrderItemDto[];
}
