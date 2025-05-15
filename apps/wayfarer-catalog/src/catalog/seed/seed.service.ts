import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DestinationEntity,
  AccommodationEntity,
  AccessoryEntity,
} from '@wayfarer/common';

import { generateDestinations } from './generators/destinations.generator';
import { generateAccommodations } from './generators/accommodations.generator';
import { generateAccessories } from './generators/accessories.generator';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(DestinationEntity)
    private readonly destinationRepo: Repository<DestinationEntity>,

    @InjectRepository(AccommodationEntity)
    private readonly accommodationRepo: Repository<AccommodationEntity>,

    @InjectRepository(AccessoryEntity)
    private readonly accessoryRepo: Repository<AccessoryEntity>,
  ) {}

  async runSeed(payload: any) {
    const result = {
      payload: JSON.stringify(payload),
    };

    if (payload.counts.destinations && payload.counts.destinations > 0) {
      await this.destinationRepo.delete({});

      const destinations = generateDestinations(payload.counts.destinations);
      const savedDestinations = await this.destinationRepo.save(destinations);

      result['destinations'] = {
        count: savedDestinations.length,
        records: savedDestinations, // Save the actual records
      };
    }

    if (payload.counts.accommodations && payload.counts.accommodations > 0) {
      await this.accommodationRepo.delete({});
      const allDestinations = await this.destinationRepo.find();
      const destinationTags = allDestinations.map((d) => d.title);

      const accommodations = generateAccommodations(
        destinationTags,
        payload.counts.accommodations,
      );
      const savedAccommodations =
        await this.accommodationRepo.save(accommodations);

      result['accommodations'] = {
        count: savedAccommodations.length,
        records: savedAccommodations, // Save the actual records
      };
    }

    if (payload.counts.accessories && payload.counts.accessories > 0) {
      await this.accessoryRepo.delete({});
      const accessories = generateAccessories(payload.counts.accessories);
      const savedAccessories = await this.accessoryRepo.save(accessories);

      result['accessories'] = {
        count: savedAccessories.length,
        records: savedAccessories, // Save the actual records
      };
    }

    return {
      status: 'success',
      message: 'Seeding complete',
      data: result, // Return dynamic data as a plain object
    };
  }
}
