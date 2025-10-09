import { PrismaClient } from '@prisma/client';
import { SearchRequest } from '@/lib/validations/api';

const prisma = new PrismaClient();

// Export individual functions for easier importing
export const getTripById = TripService.getTripById.bind(TripService);
export const searchTrips = TripService.searchTrips.bind(TripService);
export const getFeaturedTrips = TripService.getFeaturedTrips.bind(TripService);
export const getFilterOptions = TripService.getFilterOptions.bind(TripService);

export interface SearchOptions {
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'rating' | 'duration' | 'popularity' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface TripSearchResult {
  id: string;
  title: string;
  description: string;
  locationName: string;
  latitude: number;
  longitude: number;
  duration: number;
  basePrice: number;
  images: string[];
  inclusions: string[];
  boatType: string;
  fishingTypes: string[];
  maxGuests: number;
  rating: number;
  reviewCount: number;
  bookingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResponse {
  trips: TripSearchResult[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class TripService {
  static async searchTrips(
    searchParams: SearchRequest,
    options: SearchOptions = {}
  ): Promise<SearchResponse> {
    const {
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const skip = (page - 1) * limit;

    // Build where conditions
    const whereConditions = this.buildWhereConditions(searchParams);

    // Build orderBy clause
    const orderBy = this.buildOrderByClause(sortBy, sortOrder);

    // Execute queries
    const [trips, totalCount] = await Promise.all([
      prisma.trip.findMany({
        where: whereConditions,
        orderBy,
        skip,
        take: limit,
        include: {
          reviews: {
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              reviews: true,
              bookings: true
            }
          }
        }
      }),
      prisma.trip.count({
        where: whereConditions
      })
    ]);

    // Format results
    const formattedTrips = trips.map(this.formatTripResult);

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      trips: formattedTrips,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      }
    };
  }

  private static buildWhereConditions(searchParams: SearchRequest) {
    const whereConditions: any = {};

    // Location filtering (case-insensitive search)
    if (searchParams.location) {
      whereConditions.locationName = {
        contains: searchParams.location,
        mode: 'insensitive'
      };
    }

    // Guest capacity filtering
    whereConditions.maxGuests = {
      gte: searchParams.guests
    };

    // Apply filters if provided
    if (searchParams.filters) {
      const { priceRange, boatType, fishingType, duration } = searchParams.filters;

      if (priceRange && priceRange.length === 2) {
        whereConditions.basePrice = {
          gte: priceRange[0],
          lte: priceRange[1]
        };
      }

      if (boatType && boatType.length > 0) {
        whereConditions.boatType = {
          in: boatType
        };
      }

      if (fishingType && fishingType.length > 0) {
        whereConditions.fishingTypes = {
          hasSome: fishingType
        };
      }

      if (duration && duration.length > 0) {
        whereConditions.duration = {
          in: duration
        };
      }
    }

    // Date availability filtering (check for booking conflicts)
    if (searchParams.startDate) {
      whereConditions.NOT = {
        bookings: {
          some: {
            AND: [
              {
                OR: [
                  {
                    startDate: {
                      lte: searchParams.endDate || searchParams.startDate
                    },
                    endDate: {
                      gte: searchParams.startDate
                    }
                  },
                  {
                    startDate: {
                      lte: searchParams.startDate
                    },
                    endDate: null
                  }
                ]
              },
              {
                status: {
                  in: ['CONFIRMED', 'PENDING']
                }
              }
            ]
          }
        }
      };
    }

    return whereConditions;
  }

  private static buildOrderByClause(sortBy: string, sortOrder: string) {
    const order = sortOrder as 'asc' | 'desc';
    
    switch (sortBy) {
      case 'price':
        return { basePrice: order };
      case 'rating':
        return { reviews: { _count: order } }; // Sort by review count as proxy
      case 'duration':
        return { duration: order };
      case 'popularity':
        return { bookings: { _count: order } };
      default:
        return { createdAt: order };
    }
  }

  private static formatTripResult(trip: any): TripSearchResult {
    const avgRating = trip.reviews.length > 0 
      ? trip.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / trip.reviews.length
      : 0;

    return {
      id: trip.id,
      title: trip.title,
      description: trip.description,
      locationName: trip.locationName,
      latitude: trip.latitude,
      longitude: trip.longitude,
      duration: trip.duration,
      basePrice: Number(trip.basePrice),
      images: trip.images,
      inclusions: trip.inclusions,
      boatType: trip.boatType,
      fishingTypes: trip.fishingTypes,
      maxGuests: trip.maxGuests,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: trip._count.reviews,
      bookingCount: trip._count.bookings,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt
    };
  }

  static async getFeaturedTrips(limit: number = 8): Promise<TripSearchResult[]> {
    const trips = await prisma.trip.findMany({
      take: limit,
      orderBy: [
        { bookings: { _count: 'desc' } },
        { reviews: { _count: 'desc' } }
      ],
      include: {
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true,
            bookings: true
          }
        }
      }
    });

    return trips.map(this.formatTripResult);
  }

  static async getTripById(id: string): Promise<TripSearchResult | null> {
    try {
      const trip = await prisma.trip.findUnique({
        where: { id },
        include: {
          reviews: {
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              reviews: true,
              bookings: true
            }
          }
        }
      });

      if (!trip) {
        return null;
      }

      return this.formatTripResult(trip);
    } catch (error) {
      console.error('Error fetching trip by ID:', error);
      return null;
    }
  }

  static async getFilterOptions() {
    const [boatTypes, fishingTypes, priceRange, durations] = await Promise.all([
      prisma.trip.findMany({
        select: { boatType: true },
        distinct: ['boatType']
      }),
      prisma.trip.findMany({
        select: { fishingTypes: true }
      }),
      prisma.trip.aggregate({
        _min: { basePrice: true },
        _max: { basePrice: true }
      }),
      prisma.trip.findMany({
        select: { duration: true },
        distinct: ['duration'],
        orderBy: { duration: 'asc' }
      })
    ]);

    // Extract unique fishing types from arrays
    const uniqueFishingTypes = Array.from(
      new Set(fishingTypes.flatMap(trip => trip.fishingTypes))
    );

    return {
      boatTypes: boatTypes.map(t => t.boatType),
      fishingTypes: uniqueFishingTypes,
      priceRange: [
        Number(priceRange._min.basePrice) || 0,
        Number(priceRange._max.basePrice) || 1000
      ],
      durations: durations.map(d => d.duration)
    };
  }
}