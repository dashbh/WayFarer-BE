import { Injectable } from '@nestjs/common';

@Injectable()
export class CatalogService {
  getCatalogList() {
    return [
      { id: 1, name: 'Item 1', description: 'Description of Item 1' },
      { id: 2, name: 'Item 2', description: 'Description of Item 2' },
    ];
  }

  getCatalogItem(data: { id: string }) {
    const catalogItems = [
      { id: '1', name: 'Item 1', description: 'Description of Item 1' },
      { id: '2', name: 'Item 2', description: 'Description of Item 2' },
    ];

    return catalogItems.find((item) => item.id === data.id);
  }
}
