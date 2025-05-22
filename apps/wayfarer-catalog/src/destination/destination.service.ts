import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  buildMongoQuery,
  Destination,
  DestinationDocument,
  ListRequestDto,
  ListResponse,
  mapToGrcpResponse,
} from '@wayfarer/common';
import { DestinationDto } from '@wayfarer/common';
import { mapToDestinationDto } from '@wayfarer/common';

@Injectable()
export class DestinationService {
  private readonly logger = new Logger(DestinationService.name);

  constructor(
    @InjectModel(Destination.name)
    private readonly destinationModel: Model<DestinationDocument>,
  ) {}

  async findById(id: string): Promise<DestinationDto> {
    try {
      const destination = await this.destinationModel
        .findOne({ locationTag: id })
        .lean();

      if (!destination) {
        throw new NotFoundException(
          `Destination with locationTag ${id} not found`,
        );
      }

      return mapToDestinationDto(destination);
    } catch (error) {
      this.logger.error(
        `Error finding destination by id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(queryDto: ListRequestDto): Promise<ListResponse<Destination>> {
    const { query, sort, skip, limit } = buildMongoQuery(queryDto);
    const items = await this.destinationModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    // Get total count for pagination metadata
    const totalCount = await this.destinationModel.countDocuments(query);

    return mapToGrcpResponse({
      items: items.map(mapToDestinationDto),
      total: totalCount,
      ...queryDto,
    });
  }
}
