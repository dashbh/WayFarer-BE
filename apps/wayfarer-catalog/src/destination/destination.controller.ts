import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import {
  mapToGrpcDestination,
  mapToGrpcDestinationsResponse,
} from '@wayfarer/common';

import { DestinationService } from './destination.service';

@Controller()
export class DestinationController {
  private readonly logger = new Logger(DestinationController.name);

  constructor(private readonly destinationService: DestinationService) {}

  @GrpcMethod('wayfarer.catalog.CatalogGrpcService', 'GetDestination')
  async getDestination(data: any) {
    this.logger.log(`Fetching destination with id: ${data.id}`);
    try {
      const destination = await this.destinationService.findById(data.id);
      return mapToGrpcDestination(destination);
    } catch (error) {
      this.logger.error(
        `Error fetching destination with id ${data.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @GrpcMethod('wayfarer.catalog.CatalogGrpcService', 'GetAllDestinations')
  async getAllDestinations({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }) {
    this.logger.log(
      `Fetching all destinations with limit: ${limit}, offset: ${offset}`,
    );
    try {
      const { destinations, total } = await this.destinationService.findAll(
        limit,
        offset,
      );
      return mapToGrpcDestinationsResponse(destinations, total);
    } catch (error) {
      this.logger.error(
        `Error fetching all destinations: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @GrpcMethod('wayfarer.catalog.DestinationGrpcService', 'SearchDestinations')
  async searchDestinations({
    searchTerm,
    country,
    tags,
    limit,
    offset,
  }: {
    searchTerm?: string;
    country?: string;
    tags?: string[];
    limit: number;
    offset: number;
  }) {
    this.logger.log(
      `Searching destinations with term: "${searchTerm}", country: "${country}", tags: [${tags}], limit: ${limit}, offset: ${offset}`,
    );
    try {
      const { destinations, total } = await this.destinationService.search(
        searchTerm,
        country,
        tags,
        limit,
        offset,
      );

      return mapToGrpcDestinationsResponse(destinations, total);
    } catch (error) {
      this.logger.error(
        `Error searching destinations: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
