import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CatalogService } from './catalog.service';
import { HttpResponse } from '@wayfarer/common';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern({ cmd: 'get_catalog_list' })  // Handles get catalog list request
  getCatalogList() {
    const data =  this.catalogService.getCatalogList();
    return HttpResponse.success(data, 'Success');
  }

  @MessagePattern({ cmd: 'get_catalog_item' })  // Handles get catalog item by id request
  getCatalogItem(data: { id: string }) {
    return HttpResponse.success(this.catalogService.getCatalogItem(data), 'Success');
  }
}
