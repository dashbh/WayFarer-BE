import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatalogDto, CatalogItemEntity } from '@wayfarer/common';
import { classToPlain, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CatalogService implements OnModuleInit {
  constructor(
    @InjectRepository(CatalogItemEntity)
    private readonly catalogRepo: Repository<CatalogItemEntity>,
  ) {}

  async onModuleInit() {
    await this.seedCatalogIfOutOfSync();
  }

  async getCatalogList(page = 1, limit = 20) {
    const [items, total] = await this.catalogRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const response = {
      data: items,
      total,
      page,
      limit,
      totalPages: total > 0 ? Math.ceil(total / limit) : 0,
    };

    return response;
  }

  getCatalogItem(data: { id: string }) {
    return this.catalogRepo.findOneBy({ id: data.id });
  }

  async seedCatalogIfOutOfSync() {
    const dbCount = await this.catalogRepo.count();

    const seedPath = path.resolve(process.cwd(), 'seed', 'catalog.json');
    const catalogData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    const seedCount = catalogData.length;

    if (dbCount !== seedCount) {
      await this.catalogRepo.delete({}); // deletes all rows before seeding
      await this.catalogRepo.save(catalogData);
      console.log(
        `✅ Catalog re-seeded (${seedCount} items inserted, previous count was ${dbCount})`,
      );
    } else {
      console.log('ℹ️ Catalog already up to date');
    }
  }
}
