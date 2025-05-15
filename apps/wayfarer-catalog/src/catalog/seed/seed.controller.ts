import { Controller, Body, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';

import { SeedService } from './seed.service';

@Controller()
export class SeedController {
  private readonly logger = new Logger(SeedController.name);

  constructor(private readonly seedService: SeedService) {}

  @GrpcMethod('wayfarer.catalog.CatalogGrpcService', 'SeedCatalogData')
  async seedCatalogData(@Body() payload: any) {
    try {
      const response = await this.seedService.runSeed(payload);
      this.logger.log(`Seeding Payload: -> ${JSON.stringify(payload)}`);
      return response;
    } catch (error) {
      this.logger.error(`Not able to seed: ${error.message}`);
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: 'Unable to seed catalog',
      });
    }
  }
}
