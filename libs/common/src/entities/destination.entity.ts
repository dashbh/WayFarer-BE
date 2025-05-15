import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('destinations')
export class DestinationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  country: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column()
  imageUrl: string;

  @Column('decimal', { precision: 2, scale: 1, nullable: true })
  rating: number;

  @Column('int', { nullable: true })
  totalRatings: number;
}
