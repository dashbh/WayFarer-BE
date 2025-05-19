export interface AccommodationDto2 {
  id: string;
  name: string;
  locationTag: string; // e.g., "goa_india", links to Destination
  address: string;
  latitude: number;
  longitude: number;

  imageUrl: string;
  galleryImages?: string[];

  rating: number;
  totalRatings: number;
  reviewSummary?: string;

  pricePerNight: number;
  currency: string; // e.g., "INR", "USD"

  amenities?: string[]; // e.g., ["Free Wi-Fi", "Pool", "Gym"]
  roomTypes?: string[]; // e.g., ["Standard", "Deluxe", "Suite"]
  availability?: {
    from: Date;
    to: Date;
  };

  isRecommended?: boolean;
  isTrending?: boolean;
  isFavorite?: boolean;

  bookingUrl?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}
