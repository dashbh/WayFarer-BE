import {
  DestinationDto,
  PriceRange,
  PointOfInterest,
  Activity,
} from '@wayfarer/common';

/**
 * Maps a MongoDB document to the DestinationDto format
 * @param doc MongoDB document from destination collection
 * @returns Properly formatted DestinationDto
 */
export function mapToDestinationDto(doc: any): DestinationDto | null {
  if (!doc) return null;

  return {
    id: doc.locationTag || doc.id || doc._id?.toString(),
    title: doc.title || '',
    country: doc.country || '',
    region: doc.region || undefined,
    city: doc.city || undefined,
    description: doc.description || undefined,

    latitude: Number(doc.latitude) || 0,
    longitude: Number(doc.longitude) || 0,

    imageUrl: doc.imageUrl || '',
    galleryImages: Array.isArray(doc.galleryImages)
      ? doc.galleryImages
      : undefined,

    rating: Number(doc.rating) || 0,
    totalRatings: Number(doc.totalRatings) || 0,
    reviewSummary: doc.reviewSummary || undefined,
    reviewCategories: mapReviewCategories(doc.reviewCategories),

    locationTag: doc.locationTag || '',
    tags: Array.isArray(doc.tags) ? doc.tags : undefined,
    isTrending: doc.isTrending === true,
    isFavorite: doc.isFavorite === true,

    bestTimeToVisit: Array.isArray(doc.bestTimeToVisit)
      ? doc.bestTimeToVisit
      : undefined,
    suggestedDuration: doc.suggestedDuration
      ? {
          min: Number(doc.suggestedDuration.min) || 0,
          max: Number(doc.suggestedDuration.max) || 0,
        }
      : undefined,

    suggestedBudget: mapSuggestedBudget(doc.suggestedBudget),
    averageDailyCost: Number(doc.averageDailyCost) || undefined,

    landmarks: Array.isArray(doc.landmarks)
      ? doc.landmarks.map(mapPointOfInterest)
      : undefined,
    activities: Array.isArray(doc.activities)
      ? doc.activities.map(mapActivity)
      : undefined,
    popularAttractions: Array.isArray(doc.popularAttractions)
      ? doc.popularAttractions
      : undefined,
    travelTips: Array.isArray(doc.travelTips) ? doc.travelTips : undefined,

    timezone: doc.timezone || undefined,
    languages: Array.isArray(doc.languages) ? doc.languages : undefined,
    currency: doc.currency || undefined,
    nearestAirport: doc.nearestAirport || undefined,
    visaRequirements: doc.visaRequirements || undefined,
    healthAndSafety: doc.healthAndSafety || undefined,

    aiGeneratedSummary: doc.aiGeneratedSummary || undefined,
    recommendedItinerary: Array.isArray(doc.recommendedItinerary)
      ? doc.recommendedItinerary.map(mapItineraryDay)
      : undefined,
    similarDestinations: Array.isArray(doc.similarDestinations)
      ? doc.similarDestinations
      : undefined,

    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt
        : new Date(doc.createdAt || Date.now()),
    updatedAt:
      doc.updatedAt instanceof Date
        ? doc.updatedAt
        : new Date(doc.updatedAt || Date.now()),
  };
}

/**
 * Maps a MongoDB document to gRPC response format
 * @param doc MongoDB document from destination collection
 * @returns gRPC compatible destination response
 */
export function mapToGrpcDestination(doc: any): any {
  if (!doc) return null;

  const destination = mapToDestinationDto(doc);
  if (!destination) return null;

  // Convert dates to ISO strings for gRPC
  return {
    ...destination,
    createdAt:
      destination.createdAt instanceof Date
        ? destination.createdAt.toISOString()
        : destination.createdAt,
    updatedAt:
      destination.updatedAt instanceof Date
        ? destination.updatedAt.toISOString()
        : destination.updatedAt,
  };
}

/**
 * Maps all destinations to gRPC response format
 * @param docs Array of MongoDB documents
 * @returns gRPC compatible destinations response with pagination
 */
export function mapToGrpcDestinationsResponse(docs: any[]): any {
  return docs.map(mapToGrpcDestination).filter(Boolean);
}

// Helper functions for mapping nested objects

function mapPriceRange(priceRange: any): PriceRange | undefined {
  if (!priceRange) return undefined;

  return {
    min: Number(priceRange.min) || 0,
    max: Number(priceRange.max) || 0,
    currency: priceRange.currency || 'USD',
  };
}

function mapPointOfInterest(poi: any): PointOfInterest | undefined {
  if (!poi) return undefined;

  return {
    id: poi.id || poi._id?.toString() || '',
    name: poi.name || '',
    description: poi.description || undefined,
    imageUrl: poi.imageUrl || undefined,
    distanceFromDestination: Number(poi.distanceFromDestination) || undefined,
    visitDuration: Number(poi.visitDuration) || undefined,
    entryFee: mapPriceRange(poi.entryFee),
    coordinates: poi.coordinates
      ? {
          latitude: Number(poi.coordinates.latitude) || 0,
          longitude: Number(poi.coordinates.longitude) || 0,
        }
      : undefined,
  };
}

function mapActivity(activity: any): Activity | undefined {
  if (!activity) return undefined;

  return {
    id: activity.id || activity._id?.toString() || '',
    name: activity.name || '',
    description: activity.description || undefined,
    imageUrl: activity.imageUrl || undefined,
    category: activity.category || '',
    durationHours: Number(activity.durationHours) || undefined,
    priceRange: mapPriceRange(activity.priceRange),
    bookingUrl: activity.bookingUrl || undefined,
    availability: activity.availability
      ? {
          seasonalAvailability: Array.isArray(
            activity.availability.seasonalAvailability,
          )
            ? activity.availability.seasonalAvailability
            : undefined,
          weekdayAvailability: Array.isArray(
            activity.availability.weekdayAvailability,
          )
            ? activity.availability.weekdayAvailability
            : undefined,
          timeSlots: Array.isArray(activity.availability.timeSlots)
            ? activity.availability.timeSlots
            : undefined,
        }
      : undefined,
    recommendedFor: Array.isArray(activity.recommendedFor)
      ? activity.recommendedFor
      : undefined,
  };
}

function mapReviewCategories(reviewCategories: any): any {
  if (!reviewCategories) return undefined;

  return {
    cleanliness: Number(reviewCategories.cleanliness) || undefined,
    safety: Number(reviewCategories.safety) || undefined,
    valueForMoney: Number(reviewCategories.valueForMoney) || undefined,
    familyFriendly: Number(reviewCategories.familyFriendly) || undefined,
    localExperience: Number(reviewCategories.localExperience) || undefined,
  };
}

function mapSuggestedBudget(suggestedBudget: any): any {
  if (!suggestedBudget) return undefined;

  return {
    budget: mapPriceRange(suggestedBudget.budget),
    midRange: mapPriceRange(suggestedBudget.midRange),
    luxury: mapPriceRange(suggestedBudget.luxury),
  };
}

function mapItineraryDay(itineraryDay: any): any {
  if (!itineraryDay) return undefined;

  return {
    day: Number(itineraryDay.day) || 0,
    activities: Array.isArray(itineraryDay.activities)
      ? itineraryDay.activities
      : [],
  };
}
