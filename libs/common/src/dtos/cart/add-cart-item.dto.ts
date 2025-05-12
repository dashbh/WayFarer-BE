import { IsString, IsInt } from 'class-validator';

export class AddItemDto {
  @IsString()
  productId: string;

  @IsInt()
  quantity: number;
}
