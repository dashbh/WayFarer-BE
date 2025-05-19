import { Expose } from 'class-transformer';

export class AccessoryDto {
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
  totalRatings: number;

  @Expose()
  tags: string[];

  @Expose()
  imageUrls: string[];

  @Expose()
  supplier: string;

  @Expose()
  currency: string;
}

export interface DestinationDto2 {
  id: string;
  title: string;
  country: string;
  description?: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  rating: number;
  totalRatings: number;
}

export interface AccommodationDto {
  id: string;
  title: string;
  description?: string;
  type: string; // rename from "type" to avoid collision
  price: number;
  rating: number;
  totalRatings: number;
  imageUrl: string;
  tags: string[];
}

export type CatalogDto = DestinationDto2 | AccommodationDto | AccessoryDto;
export type CatalogRPCDto =
  | { destination: DestinationDto2; accommodation?: never; accessory?: never }
  | { accommodation: AccommodationDto; destination?: never; accessory?: never }
  | { accessory: AccessoryDto; destination?: never; accommodation?: never };

export class CatalogListRequestDto {
  type: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export class CatalogListResponseDto {
  type: string; // Type of catalog -> accessories/accomodations/destinations
  data: CatalogDto[]; // List of catalog items
  total: number; // Total number of catalog items
  page: number; // Current page number
  limit: number; // Number of items per page
  totalPages: number; // Total number of pages
}

export class CatalogListgRPCResponseDto {
  type: string; // Type of catalog -> accessories/accomodations/destinations
  data: CatalogRPCDto[]; // List of catalog items
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

export class CatalogItemgRPCResponseDto {
  item: CatalogRPCDto;
}

export class CatalogSeedRequestDto {
  counts: any; // Number of items to seed
}

export class CatalogSeedResponseDto {
  status: string; // Status of the seeding operation
  message: string; // Message describing the result of the operation
}
