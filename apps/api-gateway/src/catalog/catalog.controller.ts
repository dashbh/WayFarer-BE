import {
  Controller,
  Inject,
  Get,
  Param,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import {
  CatalogItemRequestDto,
  CatalogListResponseDto,
  CatalogSeedRequestDto,
} from '@wayfarer/common';

import { JwtAuthGuard } from '../auth/auth.guard';

interface CatalogGrpcService {
  getCatalogList(
    data: Record<string, unknown>,
  ): Observable<CatalogListResponseDto>;
  getCatalogItem(
    data: CatalogItemRequestDto,
  ): Observable<CatalogItemRequestDto>;
  seedCatalogData(
    count: CatalogSeedRequestDto,
  ): Observable<CatalogSeedRequestDto>;
}

@Controller('catalog')
export class CatalogController {
  private catalogService: CatalogGrpcService;

  constructor(@Inject('CATALOG_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.catalogService =
      this.client.getService<CatalogGrpcService>('CatalogGrpcService');
    if (!this.catalogService) {
      throw new InternalServerErrorException(
        'CatalogGrpcService not initialized properly',
      );
    }
  }

  @Get() // POST /catalog - General catalog request
  // @UseGuards(JwtAuthGuard)
  async getCatalog() {
    return await lastValueFrom(this.catalogService.getCatalogList({}));
  }

  @Get('list') // GET /catalog/list - This will list all catalog items
  // @UseGuards(JwtAuthGuard)
  async getCatalogList() {
    return await lastValueFrom(this.catalogService.getCatalogList({}));
  }

  @Get('seed') // GET /catalog/seed - This will seed the catalog
  // @UseGuards(JwtAuthGuard)
  async seedCatalog() {
    return await lastValueFrom(
      this.catalogService.seedCatalogData({ count: 0 }),
    ).catch((err) => {
      console.error('Error seeding catalog:', err);
      throw new InternalServerErrorException(
        'Error seeding catalog, please check the server logs',
      );
    });
  }

  @Get(':id') // GET /catalog/:id - This will get a specific catalog item by id
  // @UseGuards(JwtAuthGuard)
  async getCatalogItem(@Param('id') id: string) {
    return await lastValueFrom(this.catalogService.getCatalogItem({ id }));
  }
}
