import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CartMongo {
  @Prop({ required: true })
  userId: string;

  @Prop({
    type: [{ productId: String, quantity: Number }],
    default: [],
  })
  items: { productId: string; quantity: number }[];
}

export const CartMongoSchema = SchemaFactory.createForClass(CartMongo);

export type CartMongoDocument = CartMongo & Document;
