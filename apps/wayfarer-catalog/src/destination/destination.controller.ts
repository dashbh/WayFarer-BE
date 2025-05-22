import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ListRequestDto, mapToGrpcDestination } from '@wayfarer/common';

import { DestinationService } from './destination.service';

@Controller()
export class DestinationController {
  private readonly logger = new Logger(DestinationController.name);

  constructor(private readonly destinationService: DestinationService) {}

  @GrpcMethod('wayfarer.catalog.CatalogGrpcService', 'GetDestination')
  async getDestination({ id }: { id: string }) {
    this.logger.log(`Fetching destination with id: ${id}`);
    try {
      const destination = await this.destinationService.findById(id);
      return mapToGrpcDestination(destination);
    } catch (error) {
      this.logger.error(
        `Error fetching destination with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @GrpcMethod('wayfarer.catalog.CatalogGrpcService', 'GetAllDestinations')
  async getAllDestinations(data: ListRequestDto) {
    this.logger.log(
      `Fetching all destinations with request: ${JSON.stringify(data)}`,
    );
    try {
      const response = await this.destinationService.findAll(data);
      // this.logger.log(`Fetched all destinations: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Error fetching all destinations: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
