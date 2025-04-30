import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('catalog_items')
export class CatalogItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  imageUrl: string;

  @Column()
  category: string;

  @Column({ unique: true })
  sku: string;

  @Column('int')
  quantity: number;

  @Column()
  brand: string;

  @Column('decimal', { nullable: true })
  length: number;

  @Column('decimal', { nullable: true })
  width: number;

  @Column('decimal', { nullable: true })
  height: number;

  @Column('decimal', { nullable: true })
  weight: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  dateAdded: Date;

  @Column('decimal', { nullable: true })
  discountPrice: number;

  @Column('timestamp', { nullable: true })
  discountStartDate: Date;

  @Column('timestamp', { nullable: true })
  discountEndDate: Date;

  @Column('decimal', { precision: 2, scale: 1, nullable: true })
  rating: number;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @Column('text', { array: true, nullable: true })
  imageUrls: string[];

  @Column({ nullable: true })
  supplier: string;

  @Column({ default: 'USD' })
  currency: string;
}
