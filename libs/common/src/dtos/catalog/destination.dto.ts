// ==============================
// Destination DTO
// ==============================

export interface DestinationDto {
  // ────────────────
  // Core Info
  // ────────────────
  id: string;
  title: string;
  country: string;
  region?: string;
  city?: string;
  description?: string;

  // ────────────────
  // Geo Location
  // ────────────────
  latitude: number;
  longitude: number;

  // ────────────────
  // Media
  // ────────────────
  imageUrl: string;
  galleryImages?: string[];

  // ────────────────
  // Ratings & Reviews
  // ────────────────
  rating: number;
  totalRatings: number;
  reviewSummary?: string;
  reviewCategories?: {
    cleanliness?: number;
    safety?: number;
    valueForMoney?: number;
    familyFriendly?: number;
    localExperience?: number;
  };

  // ────────────────
  // Linking & Tags
  // ────────────────
  locationTag: string; // For linking to hotels, restaurants, etc.
  tags?: string[]; // e.g., ["beach", "adventure", "romantic"]
  isTrending?: boolean;
  isFavorite?: boolean;

  // ────────────────
  // Seasonal & Travel Info
  // ────────────────
  bestTimeToVisit?: string[]; // e.g., ["November", "December"]
  suggestedDuration?: { min: number; max: number }; // Suggested visit days
  suggestedBudget?: {
    budget: PriceRange;
    midRange: PriceRange;
    luxury: PriceRange;
  };
  averageDailyCost?: number;

  // ────────────────
  // Points of Interest & Activities
  // ────────────────
  landmarks?: PointOfInterest[];
  activities?: Activity[];
  popularAttractions?: string[];
  travelTips?: string[];

  // ────────────────
  // Practical Information
  // ────────────────
  timezone?: string;
  languages?: string[];
  currency?: string; // ISO code like "INR"
  nearestAirport?: string;
  visaRequirements?: string;
  healthAndSafety?: string;

  // ────────────────
  // AI & Personalization
  // ────────────────
  aiGeneratedSummary?: string;
  recommendedItinerary?: {
    day: number;
    activities: string[];
  }[];
  similarDestinations?: string[];

  // ────────────────
  // Metadata
  // ────────────────
  createdAt: Date;
  updatedAt: Date;
}

// ==============================
// Supporting Interfaces
// ==============================

export interface PriceRange {
  min: number;
  max: number;
  currency: string; // e.g., "USD"
}

export interface PointOfInterest {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  distanceFromDestination?: number; // in km
  visitDuration?: number; // in hours
  entryFee?: PriceRange;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Activity {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category: string; // "Adventure", "Cultural", etc.
  durationHours?: number;
  priceRange?: PriceRange;
  bookingUrl?: string;
  availability?: {
    seasonalAvailability?: string[];
    weekdayAvailability?: string[];
    timeSlots?: string[];
  };
  recommendedFor?: string[]; // e.g., ["Families", "Solo travelers"]
}
