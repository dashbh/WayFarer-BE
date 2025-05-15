import { faker } from '@faker-js/faker';
import { AccessoryEntity } from '@wayfarer/common';

export function generateAccessories(count: number): Partial<AccessoryEntity>[] {
  return Array.from({ length: count }).map(() => {
    const dateAdded = faker.date.future();
    const discountStartDate = faker.date.soon({ days: 5, refDate: dateAdded });
    const discountEndDate = faker.date.soon({
      days: 7,
      refDate: discountStartDate,
    });

    return {
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.sentences(),
      price: parseFloat(faker.commerce.price({ min: 100, max: 2000 })),
      imageUrl: faker.image.urlPicsumPhotos({
        width: 500,
        height: 500,
        blur: 0,
      }),
      imageUrls: Array.from({ length: 3 }).map(() =>
        faker.image.urlPicsumPhotos({ width: 500, height: 500, blur: 0 }),
      ),
      category: faker.commerce.department(),
      sku: `TRV-${faker.string.uuid()}`,
      quantity: faker.number.int({ min: 1, max: 100 }),
      brand: faker.company.name(),
      length: parseFloat(
        faker.number.float({ min: 5, max: 20, fractionDigits: 2 }).toFixed(2),
      ),
      width: parseFloat(
        faker.number.float({ min: 5, max: 20, fractionDigits: 2 }).toFixed(2),
      ),
      height: parseFloat(
        faker.number.float({ min: 5, max: 20, fractionDigits: 2 }).toFixed(2),
      ),
      weight: parseFloat(
        faker.number.float({ min: 1, max: 10, fractionDigits: 2 }).toFixed(2),
      ),
      dateAdded: dateAdded,
      discountPrice:
        parseFloat((Math.random() * 0.8 + 0.1).toFixed(2)) *
        parseFloat(faker.commerce.price({ min: 100, max: 2000 })),
      discountStartDate: discountStartDate,
      discountEndDate: discountEndDate,
      rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
      totalRatings: faker.number.int({ min: 10, max: 1000 }),
      tags: faker.helpers.arrayElements(
        ['durable', 'carry-on', 'eco-friendly', 'lightweight', 'waterproof'],
        2,
      ),
      supplier: faker.person.fullName(),
      currency: '₹',
    };
  });
}
