import { Expose } from 'class-transformer';

export class CatalogDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  imageUrl: string;

  @Expose()
  category: string;

  @Expose()
  sku: string;

  @Expose()
  quantity: number;

  @Expose()
  brand: string;

  @Expose()
  length: number;

  @Expose()
  width: number;

  @Expose()
  height: number;

  @Expose()
  weight: number;

  @Expose()
  dateAdded: Date;

  @Expose()
  discountPrice: number;

  @Expose()
  discountStartDate: Date;

  @Expose()
  discountEndDate: Date;

  @Expose()
  rating: number;

  @Expose()
  tags: string[];

  @Expose()
  imageUrls: string[];

  @Expose()
  supplier: string;

  @Expose()
  currency: string;
}

export class CatalogListRequestDto {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export class CatalogListResponseDto {
  data: CatalogDto[]; // List of catalog items
  total: number; // Total number of catalog items
  page: number; // Current page number
  limit: number; // Number of items per page
  totalPages: number; // Total number of pages
}

export class CatalogItemRequestDto {
  id: string;
}

export class CatalogItemResponseDto {
  item: CatalogDto;
}
