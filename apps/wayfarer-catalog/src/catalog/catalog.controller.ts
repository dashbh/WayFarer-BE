import { Controller, Logger, Query } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { CatalogService } from './catalog.service';
import {
  CatalogListResponseDto,
  CatalogItemRequestDto,
  CatalogItemResponseDto,
} from '@wayfarer/common';
import { status as GrpcStatus } from '@grpc/grpc-js';

@Controller()
export class CatalogController {
  private readonly logger = new Logger(CatalogController.name);

  constructor(private readonly catalogService: CatalogService) {}

  @GrpcMethod('wayfarer.catalog.CatalogGrpcService', 'GetCatalogList')
  async getCatalogList(
    @Query('page') page = '1', // default to page 1 if not provided
    @Query('limit') limit = '20', // default to 100 if not provided
  ): Promise<CatalogListResponseDto> {
    let parsedPage = parseInt(page);
    let parsedLimit = parseInt(limit);

    // Check if parsing was successful
    if (isNaN(parsedPage) || parsedPage <= 0) {
      parsedPage = 1;
    }

    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      parsedLimit = 20;
    }
    const items = await this.catalogService.getCatalogList(
      parsedPage,
      parsedLimit,
    );

    if (!items) {
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: 'Catalog list not found',
      });
    }

    return items;
  }

  @GrpcMethod('wayfarer.catalog.CatalogGrpcService', 'GetCatalogItem')
  async getCatalogItem(
    data: CatalogItemRequestDto,
  ): Promise<CatalogItemResponseDto> {
    try {
      const item = await this.catalogService.getCatalogItem({ id: data.id });
      if (!item) {
        throw new RpcException({
          code: GrpcStatus.NOT_FOUND,
          message: 'Catalog item not found',
        });
      }
      return { item };
    } catch (error) {
      this.logger.error(`Error fetching catalog item: ${error.message}`);
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: 'Catalog item not found',
      });
    }
  }
}
