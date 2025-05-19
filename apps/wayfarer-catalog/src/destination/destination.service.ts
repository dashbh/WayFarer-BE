import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Destination, DestinationDocument } from '@wayfarer/common';
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
        .findOne({ _id: new Types.ObjectId(id) })
        .lean();

      if (!destination) {
        throw new NotFoundException(`Destination with ID ${id} not found`);
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

  async findAll(
    limit = 10,
    offset = 0,
  ): Promise<{ destinations: DestinationDto[]; total: number }> {
    try {
      const [documents, total] = await Promise.all([
        this.destinationModel.find().skip(offset).limit(limit).lean(),
        this.destinationModel.countDocuments(),
      ]);

      const destinations = documents
        .map((doc) => mapToDestinationDto(doc))
        .filter(Boolean);

      return { destinations, total };
    } catch (error) {
      this.logger.error(
        `Error finding all destinations: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async search(
    searchTerm?: string,
    country?: string,
    tags?: string[],
    limit = 10,
    offset = 0,
  ): Promise<{ destinations: DestinationDto[]; total: number }> {
    try {
      const query: any = {};

      if (searchTerm) {
        query.$or = [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
        ];
      }

      if (country) {
        query.country = country;
      }

      if (tags && tags.length > 0) {
        query.tags = { $in: tags };
      }

      const [documents, total] = await Promise.all([
        this.destinationModel.find(query).skip(offset).limit(limit).lean(),
        this.destinationModel.countDocuments(query),
      ]);

      const destinations = documents
        .map((doc) => mapToDestinationDto(doc))
        .filter(Boolean);

      return { destinations, total };
    } catch (error) {
      this.logger.error(
        `Error searching destinations: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
