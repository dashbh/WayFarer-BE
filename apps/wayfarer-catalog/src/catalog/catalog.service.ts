import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AccessoryEntity,
  AccommodationEntity,
  CatalogItemType,
  DestinationEntity,
} from '@wayfarer/common';
import { Repository } from 'typeorm';
// import * as path from 'path';
// import * as fs from 'fs';

@Injectable()
export class CatalogService implements OnModuleInit {
  constructor(
    @InjectRepository(DestinationEntity)
    private readonly destinationRepo: Repository<DestinationEntity>,
    @InjectRepository(AccommodationEntity)
    private readonly accommodationRepo: Repository<AccommodationEntity>,
    @InjectRepository(AccessoryEntity)
    private readonly accessoryRepo: Repository<AccessoryEntity>,
  ) {}

  async onModuleInit() {
    // await this.seedCatalogIfOutOfSync();
  }

  async getCatalogList(
    type: string,
    page = 1,
    limit = 20,
    sortBy = '',
    sortOrder: 'asc' | 'desc' = 'asc',
    search = '',
  ) {
    try {
      const catalogRepo = this.getRepoByType(type);
      const qb = catalogRepo.createQueryBuilder(type);

      // Search (example: search in name and description if available)
      if (search) {
        if (
          type === CatalogItemType.DESTINATION ||
          type === CatalogItemType.ACCOMMODATION
        ) {
          qb.where(`${type}.title ILIKE :search`, { search: `%${search}%` });
        }
        if (type === CatalogItemType.ACCESSORY) {
          qb.where(
            `${type}.title ILIKE :search OR ${type}.description ILIKE :search`,
            { search: `%${search}%` },
          );
        }
      }

      // Sorting
      if (sortBy) {
        qb.orderBy(
          `${type}.${sortBy}`,
          sortOrder.toUpperCase() as 'ASC' | 'DESC',
        );
      }

      // Pagination
      qb.skip((page - 1) * limit).take(limit);

      const [items, total] = await qb.getManyAndCount();

      const data = items.map((item) => {
        // Dynamically use the CatalogItemType enum values as keys
        for (const typeKey of Object.values(CatalogItemType)) {
          if (type === typeKey) {
            return { [typeKey]: item };
          }
        }
        // fallback for unexpected structure
        return {};
      });

      const response = {
        data,
        type,
        total,
        page,
        limit,
        totalPages: total > 0 ? Math.ceil(total / limit) : 0,
      };

      return response;
    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Failed to fetch catalog list',
      );
    }
  }

  async getCatalogItem(data: { id: string }) {
    const item = await this.accessoryRepo.findOneBy({ id: data.id });

    return {
      item,
      type: 'accessory',
    };
  }

  getRepoByType(type: string): Repository<any> {
    switch (type) {
      case CatalogItemType.DESTINATION:
        return this.destinationRepo;
      case CatalogItemType.ACCOMMODATION:
        return this.accommodationRepo;
      case CatalogItemType.ACCESSORY:
        return this.accessoryRepo;
      default:
        throw new BadRequestException('Invalid catalog type');
    }
  }

  // async seedCatalogItems(data: { count: number }) {
  //   try {
  //     const dbCount = await this.catalogRepo.count();

  //     const seedPath = path.resolve(process.cwd(), 'seed', 'catalog.json');
  //     const catalogData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  //     const seedCount = catalogData.length;
  //     await this.catalogRepo.delete({}); // deletes all rows before seeding
  //     await this.catalogRepo.save(catalogData);

  //     return {
  //       status: 'success',
  //       message: `✅ Catalog re-seeded (${seedCount} items inserted, previous count was ${dbCount})`,
  //       count: data,
  //     };
  //   } catch (error) {
  //     console.error('Error seeding catalog:', error);
  //     throw new Error('Failed to seed catalog');
  //   }
  // }

  // async seedCatalogIfOutOfSync() {
  //   const dbCount = await this.catalogRepo.count();

  //   const seedPath = path.resolve(process.cwd(), 'seed', 'catalog.json');
  //   const catalogData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  //   const seedCount = catalogData.length;

  //   if (dbCount !== seedCount) {
  //     await this.catalogRepo.delete({}); // deletes all rows before seeding
  //     await this.catalogRepo.save(catalogData);
  //     console.log(
  //       `✅ Catalog re-seeded (${seedCount} items inserted, previous count was ${dbCount})`,
  //     );
  //   } else {
  //     console.log('ℹ️ Catalog already up to date');
  //   }
  // }
}
