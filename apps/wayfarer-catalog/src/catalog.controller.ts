import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern({ cmd: 'get_catalog_list' })  // Handles get catalog list request
  getCatalogList() {
    return this.catalogService.getCatalogList();
  }

  @MessagePattern({ cmd: 'get_catalog_item' })  // Handles get catalog item by id request
  getCatalogItem(data: { id: string }) {
    return this.catalogService.getCatalogItem(data);
  }
}
