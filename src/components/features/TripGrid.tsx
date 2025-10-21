'use client';

import { useState } from 'react';
import TripCard from './TripCard';
import { TripSearchResult } from '@/lib/services/tripService';

interface TripGridProps {
  trips: TripSearchResult[];
  onFavorite?: (tripId: string) => void;
  favorites?: string[];
}

export default function TripGrid({ trips, onFavorite, favorites = [] }: TripGridProps) {
  const [favoriteTrips, setFavoriteTrips] = useState<Set<string>>(new Set(favorites));

  const handleFavorite = (tripId: string) => {
    setFavoriteTrips(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tripId)) {
        newFavorites.delete(tripId);
      } else {
        newFavorites.add(tripId);
      }
      return newFavorites;
    });
    
    onFavorite?.(tripId);
  };

  // Convert TripSearchResult to Trip format for TripCard
  const convertToTripFormat = (trip: TripSearchResult) => ({
    id: trip.id,
    title: trip.title,
    description: trip.description,
    location: {
      name: trip.locationName,
      latitude: trip.latitude,
      longitude: trip.longitude,
    },
    duration: trip.duration,
    basePrice: trip.basePrice,
    images: trip.images,
    rating: trip.rating,
    reviewCount: trip.reviewCount,
    inclusions: trip.inclusions,
    boatType: trip.boatType,
    fishingTypes: trip.fishingTypes,
    maxGuests: trip.maxGuests,
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
  });

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No trips available</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={convertToTripFormat(trip)}
          onFavorite={handleFavorite}
          isFavorited={favoriteTrips.has(trip.id)}
        />
      ))}
    </div>
  );
}