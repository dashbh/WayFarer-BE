import { faker } from '@faker-js/faker';
import { DestinationEntity } from '@wayfarer/common';

export function generateDestinations(
  count: number,
): Partial<DestinationEntity>[] {
  return Array.from({ length: count }).map(() => ({
    title: faker.location.city(),
    description: faker.lorem.sentence(),
    country: faker.location.country(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    imageUrl: faker.image.urlPicsumPhotos({ width: 500 }),
    rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
    totalRatings: faker.number.int({ min: 10, max: 1000 }),
  }));
}
