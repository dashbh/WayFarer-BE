export class CatalogDto {
  id: string;
  name: string;
  description: string;
  price: number;
}

export class CatalogItemRequestDto {
  id: string;
}

export class CatalogItemResponseDto {
  item: CatalogDto;
}

export class CatalogListResponseDto {
  items: CatalogDto[];
}
