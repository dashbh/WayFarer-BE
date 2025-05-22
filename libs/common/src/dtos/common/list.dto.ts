import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterCriteria {
  @IsString()
  field: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' =
    'eq';
}

export class SortCriteria {
  @IsString()
  field: string;

  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.ASC;
}

export class ListRequestDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SortCriteria)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return undefined;
      }
    }
    return value;
  })
  sort?: SortCriteria[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FilterCriteria)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return undefined;
      }
    }
    return value;
  })
  filters?: FilterCriteria[];
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  search: string;
  filters: FilterCriteria[];
  sort: SortCriteria[];
}
