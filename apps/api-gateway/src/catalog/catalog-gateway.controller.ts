import { Controller, Post, Body, Inject, Get, Param, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('catalog')
export class CatalogGatewayController {
  constructor(@Inject('CATALOG_SERVICE') private readonly catalogClient: ClientProxy) {}

  @Post()  // POST /catalog - General catalog request
  @UseGuards(JwtAuthGuard)
  async getCatalog(@Body() data: {}) {
    return this.catalogClient.send({ cmd: 'catalog' }, data);
  }

  @Get('list')  // GET /catalog/list - This will list all catalog items
  @UseGuards(JwtAuthGuard)
  async getCatalogList() {
    return this.catalogClient.send({ cmd: 'get_catalog_list' }, {});
  }

  @Get(':id')  // GET /catalog/:id - This will get a specific catalog item by id
  @UseGuards(JwtAuthGuard)
  async getCatalogItem(@Param('id') id: string) {
    return this.catalogClient.send({ cmd: 'get_catalog_item' }, { id });
  }
}
