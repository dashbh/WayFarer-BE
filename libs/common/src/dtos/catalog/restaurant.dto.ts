export interface RestaurantDto {
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

  cuisine: string[]; // e.g., ["Indian", "Seafood", "Vegan"]
  priceLevel?: number; // 1 (cheap) to 5 (luxury)

  menuHighlights?: string[]; // e.g., ["Goan Fish Curry", "Paneer Tikka"]
  dietaryOptions?: string[]; // e.g., ["Vegan", "Gluten-Free"]

  openingHours?: {
    weekday: string;
    open: string; // e.g., "09:00"
    close: string; // e.g., "22:00"
  }[];

  isTrending?: boolean;
  isFavorite?: boolean;

  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };

  bookingUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}
