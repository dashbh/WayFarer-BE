import {
  Controller,
  Inject,
  Get,
  Param,
  UseGuards,
  InternalServerErrorException,
  Post,
  Body,
  Query,
  Logger,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import {
  CatalogItemRequestDto,
  CatalogItemResponseDto,
  CatalogItemType,
  CatalogListRequestDto,
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
  ): Observable<CatalogItemResponseDto>;
  seedCatalogData(
    counts: CatalogSeedRequestDto,
  ): Observable<CatalogSeedRequestDto>;

  getAllDestinations(data: any): Observable<any>;
  getDestination(data: any): Observable<any>;
}

@Controller('catalog')
export class CatalogController {
  private readonly logger = new Logger(CatalogController.name);
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

  // destination API's
  @Get('destinations') // GET /catalog/destinations - This will list all catalog destinations
  // @UseGuards(JwtAuthGuard)
  getAllDestinations(limit = 10, offset = 0): Observable<any> {
    return this.catalogService.getAllDestinations({ limit, offset });
  }

  @Get('destinations/:id') // GET /catalog/destinations - This will list all catalog destinations
  // @UseGuards(JwtAuthGuard)
  getDestination(id: string): Observable<any> {
    return this.catalogService.getDestination({ id });
  }

  // End destinations

  @Get('list') // GET /catalog/list - This will list all catalog items
  // @UseGuards(JwtAuthGuard)
  async getCatalogList(@Query() query: CatalogListRequestDto) {
    const request = {
      type: query.type ?? '',
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      sortBy: query.sortBy ?? '',
      sortOrder: query.sortOrder ?? '',
      search: query.search ?? '',
    };

    const response = await lastValueFrom(
      this.catalogService.getCatalogList(request),
    );

    // Determine the type key to extract from each item
    const typeKey = (
      request.type as string
    )?.toLowerCase() as keyof typeof CatalogItemType;

    if (
      Array.isArray(response.data) &&
      typeKey &&
      CatalogItemType[typeKey.toUpperCase() as keyof typeof CatalogItemType]
    ) {
      response.data = response.data.map((item: any) => item[typeKey]);
    }

    return response;
  }

  @Post('seed') // GET /catalog/seed - This will seed the catalog
  // @UseGuards(JwtAuthGuard)
  async seedCatalog(@Body() seedRequest: any) {
    return await lastValueFrom(
      this.catalogService.seedCatalogData({
        counts: seedRequest,
      }),
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
    const response = await lastValueFrom(
      this.catalogService.getCatalogItem({ id }),
    );
    // Dynamically extract the first property value from the "item" object
    if (response && response.item && typeof response.item === 'object') {
      const firstKey = Object.keys(response.item)[0];
      if (firstKey) {
        response.item = response.item[firstKey];
      }
    }
    return response;
  }
}
