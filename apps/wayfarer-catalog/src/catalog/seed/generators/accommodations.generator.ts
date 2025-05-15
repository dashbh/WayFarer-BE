import { faker } from '@faker-js/faker';
import { AccommodationEntity } from '@wayfarer/common';

export function generateAccommodations(
  tags: string[],
  count: number,
): Partial<AccommodationEntity>[] {
  return Array.from({ length: count }).map(() => ({
    title: faker.company.name() || 'NA',
    description: faker.lorem.sentences(),
    type: faker.helpers.arrayElement(['hotel', 'hostel', 'bnb']),
    price: faker.number.float({ min: 30, max: 300 }),
    rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
    totalRatings: faker.number.int({ min: 10, max: 1000 }),
    imageUrl: faker.image.urlPicsumPhotos({ width: 500 }),
    tags: faker.helpers.arrayElements(tags, { min: 2, max: 3 }),
  }));
}
