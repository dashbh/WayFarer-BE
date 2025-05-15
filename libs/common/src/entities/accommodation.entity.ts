import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('accommodations')
export class AccommodationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  type: string; // hotel, hostel, bnb

  @Column({ type: 'float' })
  price: number;

  @Column('decimal', { precision: 2, scale: 1, nullable: true })
  rating: number;

  @Column('int', { nullable: true })
  totalRatings: number;

  @Column()
  imageUrl: string;

  @Column('simple-array')
  tags: string[];
}
