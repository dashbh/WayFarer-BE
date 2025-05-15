import {
  BadRequestException,
  Controller,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  CatalogItemRequestDto,
  CatalogItemType,
  CatalogItemgRPCResponseDto,
  CatalogListRequestDto,
  CatalogListgRPCResponseDto,
  CatalogRPCDto,
} from '@wayfarer/common';
import { status as GrpcStatus } from '@grpc/grpc-js';

import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  private readonly logger = new Logger(CatalogController.name);

  constructor(private readonly catalogService: CatalogService) {}

  @GrpcMethod('wayfarer.catalog.CatalogGrpcService', 'GetCatalogList')
  async getCatalogList(
    payload: CatalogListRequestDto,
  ): Promise<CatalogListgRPCResponseDto> {
    try {
      const parsedPage = payload.page > 0 ? payload.page : 1;
      const parsedLimit = payload.limit > 0 ? payload.limit : 20;

      const items = await this.catalogService.getCatalogList(
        payload.type,
        parsedPage,
        parsedLimit,
        payload.sortBy,
        payload.sortOrder,
        payload.search,
      );

      if (!items) {
        this.logger.error('Catalog list not found', JSON.stringify(payload));
        throw new RpcException({
          code: GrpcStatus.NOT_FOUND,
          message: 'Catalog list not found',
        });
      }

      const mappedData = items.data.map((item: any) => {
        for (const typeKey of Object.values(CatalogItemType)) {
          if (item[typeKey]) {
            return { [typeKey]: item[typeKey] } as CatalogRPCDto;
          }
        }
        // fallback for unexpected structure
        return {} as CatalogRPCDto;
      });

      return {
        ...items,
        data: mappedData,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching catalog list: ${error.message}`,
        error.stack,
      );
      // Map NestJS exceptions to gRPC status codes
      if (error instanceof BadRequestException) {
        throw new RpcException({
          code: GrpcStatus.INVALID_ARGUMENT, // 3
          message: error.message,
        });
      }
      if (error instanceof NotFoundException) {
        throw new RpcException({
          code: GrpcStatus.NOT_FOUND, // 5
          message: error.message,
        });
      }
      // fallback for all other errors
      throw new RpcException({
        code: GrpcStatus.INTERNAL,
        message: 'Failed to fetch catalog list',
      });
    }
  }

  @GrpcMethod('wayfarer.catalog.CatalogGrpcService', 'GetCatalogItem')
  async getCatalogItem(
    data: CatalogItemRequestDto,
  ): Promise<CatalogItemgRPCResponseDto> {
    try {
      const itemEntity = await this.catalogService.getCatalogItem({
        id: data.id,
      });

      if (!itemEntity) {
        throw new RpcException({
          code: GrpcStatus.NOT_FOUND,
          message: 'Catalog item not found',
        });
      }

      // Wrap in the correct property for the oneof protobuff -> catalog.proto
      const wrapper: any = {};
      wrapper[itemEntity.type] = itemEntity.item;

      return {
        item: wrapper,
      } as CatalogItemgRPCResponseDto;
    } catch (error) {
      this.logger.error(`Error fetching catalog item: ${error.message}`);
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: 'Catalog item not found',
      });
    }
  }
}
