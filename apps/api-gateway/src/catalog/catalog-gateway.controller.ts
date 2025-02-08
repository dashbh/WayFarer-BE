import { Controller, Post, Body, Inject, Get, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('catalog')
export class CatalogGatewayController {
  constructor(@Inject('CATALOG_SERVICE') private readonly catalogClient: ClientProxy) {}

  @Post()  // POST /catalog - General catalog request
  async getCatalog(@Body() data: {}) {
    return this.catalogClient.send({ cmd: 'catalog' }, data);
  }

  @Get('list')  // GET /catalog/list - This will list all catalog items
  async getCatalogList() {
    return this.catalogClient.send({ cmd: 'get_catalog_list' }, {});
  }

  @Get(':id')  // GET /catalog/:id - This will get a specific catalog item by id
  async getCatalogItem(@Param('id') id: string) {
    return this.catalogClient.send({ cmd: 'get_catalog_item' }, { id });
  }
}
