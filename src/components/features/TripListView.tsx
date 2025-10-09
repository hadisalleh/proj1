'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, MapPin, Clock, Users } from 'lucide-react';
import { TripSearchResult } from '@/lib/services/tripService';

interface TripListViewProps {
  trips: TripSearchResult[];
  onFavorite?: (tripId: string) => void;
  favorites?: string[];
}

export default function TripListView({ trips, onFavorite, favorites = [] }: TripListViewProps) {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No trips available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {trips.map((trip) => (
        <Link key={trip.id} href={`/trips/${trip.id}`} className="block group">
          <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative w-full sm:w-80 h-48 sm:h-64 bg-gray-200 flex-shrink-0">
                {trip.images.length > 0 ? (
                  <Image
                    src={trip.images[0]}
                    alt={trip.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 320px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <div className="text-white text-4xl">🎣</div>
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFavorite(trip.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 group/heart"
                  aria-label={favoriteTrips.has(trip.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    className={`h-5 w-5 transition-colors duration-200 ${
                      favoriteTrips.has(trip.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600 group-hover/heart:text-red-500'
                    }`}
                  />
                </button>

                {/* Price Badge */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(trip.basePrice)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                      {trip.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{trip.locationName}</span>
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {renderStars(trip.rating)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {trip.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">
                        ({trip.reviewCount} {trip.reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4 flex-1">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {trip.description}
                    </p>
                  </div>

                  {/* Trip Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatDuration(trip.duration)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Up to {trip.maxGuests} guests</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {trip.boatType}
                      </span>
                      {trip.fishingTypes.slice(0, 3).map((type, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                      {trip.fishingTypes.length > 3 && (
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          +{trip.fishingTypes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inclusions Preview */}
                  {trip.inclusions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Includes:</h4>
                      <div className="text-sm text-gray-600">
                        {trip.inclusions.slice(0, 3).join(', ')}
                        {trip.inclusions.length > 3 && (
                          <span className="text-blue-600 ml-1">
                            +{trip.inclusions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      Starting from{' '}
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(trip.basePrice)}
                      </span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors duration-200">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}