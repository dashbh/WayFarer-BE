import {
  Controller,
  Inject,
  Get,
  Param,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/auth.guard';
import { lastValueFrom, Observable } from 'rxjs';
import {
  CatalogItemRequestDto,
  CatalogListResponseDto,
} from '@wayfarer/common';

interface CatalogGrpcService {
  getCatalogList(data: {}): Observable<CatalogListResponseDto>;
  getCatalogItem(
    data: CatalogItemRequestDto,
  ): Observable<CatalogItemRequestDto>;
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
        'AuthGrpcService not initialized properly',
      );
    }
  }

  @Get() // POST /catalog - General catalog request
  @UseGuards(JwtAuthGuard)
  async getCatalog() {
    return await lastValueFrom(this.catalogService.getCatalogList({}));
  }

  @Get('list') // GET /catalog/list - This will list all catalog items
  @UseGuards(JwtAuthGuard)
  async getCatalogList() {
    return await lastValueFrom(this.catalogService.getCatalogList({}));
  }

  @Get(':id') // GET /catalog/:id - This will get a specific catalog item by id
  @UseGuards(JwtAuthGuard)
  async getCatalogItem(@Param('id') id: string) {
    return await lastValueFrom(this.catalogService.getCatalogItem({ id }));
  }
}
