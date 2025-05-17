import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { CartItemDto } from '../dtos';

@Schema({ timestamps: true })
export class OrderMongo {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  cartId: string;

  @Prop({ type: [Object], required: true })
  items: CartItemDto[];

  @Prop()
  total: number;

  @Prop()
  subTotal: number;

  @Prop()
  taxes: number;

  @Prop()
  currency: string;

  @Prop()
  totalDiscount: number;

  @Prop()
  itemCount: number;

  @Prop({ default: 'pending' })
  orderStatus: string;

  @Prop({ required: true })
  shippingAddress: string;

  @Prop({ required: true })
  shippingType: string;

  @Prop({ default: 'pending' })
  paymentStatus: string;

  @Prop({ required: true })
  paymentType: string;
}

export const OrderMongoSchema = SchemaFactory.createForClass(OrderMongo);

export type OrderMongoDocument = OrderMongo & Document;
