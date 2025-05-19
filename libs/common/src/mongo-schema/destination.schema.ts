import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DestinationDocument = Destination & Document;

@Schema({ timestamps: true })
export class Destination {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  country: string;

  @Prop()
  region?: string;

  @Prop()
  city?: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: [String] })
  galleryImages?: string[];

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  totalRatings: number;

  @Prop()
  reviewSummary?: string;

  @Prop({
    type: {
      cleanliness: Number,
      safety: Number,
      valueForMoney: Number,
      familyFriendly: Number,
      localExperience: Number,
    },
  })
  reviewCategories?: {
    cleanliness?: number;
    safety?: number;
    valueForMoney?: number;
    familyFriendly?: number;
    localExperience?: number;
  };

  @Prop({ required: true })
  locationTag: string;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ default: false })
  isTrending?: boolean;

  @Prop({ default: false })
  isFavorite?: boolean;

  @Prop({ type: [String] })
  bestTimeToVisit?: string[];

  @Prop({
    type: {
      min: Number,
      max: Number,
    },
  })
  suggestedDuration?: { min: number; max: number };

  @Prop({
    type: {
      budget: {
        min: Number,
        max: Number,
        currency: String,
      },
      midRange: {
        min: Number,
        max: Number,
        currency: String,
      },
      luxury: {
        min: Number,
        max: Number,
        currency: String,
      },
    },
  })
  suggestedBudget?: {
    budget: {
      min: number;
      max: number;
      currency: string;
    };
    midRange: {
      min: number;
      max: number;
      currency: string;
    };
    luxury: {
      min: number;
      max: number;
      currency: string;
    };
  };

  @Prop()
  averageDailyCost?: number;

  @Prop([
    {
      id: String,
      name: String,
      description: String,
      imageUrl: String,
      distanceFromDestination: Number,
      visitDuration: Number,
      entryFee: {
        min: Number,
        max: Number,
        currency: String,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
  ])
  landmarks?: Array<{
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    distanceFromDestination?: number;
    visitDuration?: number;
    entryFee?: {
      min: number;
      max: number;
      currency: string;
    };
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>;

  @Prop([
    {
      id: String,
      name: String,
      description: String,
      imageUrl: String,
      category: String,
      durationHours: Number,
      priceRange: {
        min: Number,
        max: Number,
        currency: String,
      },
      bookingUrl: String,
      availability: {
        seasonalAvailability: [String],
        weekdayAvailability: [String],
        timeSlots: [String],
      },
      recommendedFor: [String],
    },
  ])
  activities?: Array<{
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    category: string;
    durationHours?: number;
    priceRange?: {
      min: number;
      max: number;
      currency: string;
    };
    bookingUrl?: string;
    availability?: {
      seasonalAvailability?: string[];
      weekdayAvailability?: string[];
      timeSlots?: string[];
    };
    recommendedFor?: string[];
  }>;

  @Prop({ type: [String] })
  popularAttractions?: string[];

  @Prop({ type: [String] })
  travelTips?: string[];

  @Prop()
  timezone?: string;

  @Prop({ type: [String] })
  languages?: string[];

  @Prop()
  currency?: string;

  @Prop()
  nearestAirport?: string;

  @Prop()
  visaRequirements?: string;

  @Prop()
  healthAndSafety?: string;

  @Prop()
  aiGeneratedSummary?: string;

  @Prop([
    {
      day: Number,
      activities: [String],
    },
  ])
  recommendedItinerary?: Array<{
    day: number;
    activities: string[];
  }>;

  @Prop({ type: [String] })
  similarDestinations?: string[];

  // Mongoose will add createdAt and updatedAt fields automatically
}

export const DestinationSchema = SchemaFactory.createForClass(Destination);
