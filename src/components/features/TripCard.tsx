'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Heart, MapPin, Clock, Users } from 'lucide-react';
import { Trip } from '@/types';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface TripCardProps {
  trip: Trip;
  onFavorite?: (tripId: string) => void;
  isFavorited?: boolean;
}

export default function TripCard({ trip, onFavorite, isFavorited = false }: TripCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(trip.id);
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

  return (
    <Link href={`/trips/${trip.id}`} className="block group touch-manipulation">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 overflow-hidden">
        {/* Image Container */}
        <div className="relative h-48 bg-gray-200">
          {!imageError && trip.images.length > 0 ? (
            <OptimizedImage
              src={trip.images[0]}
              alt={trip.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={80}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <div className="text-white text-4xl">🎣</div>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-3 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 group/heart touch-manipulation"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`h-6 w-6 transition-colors duration-200 ${
                isFavorited
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
        <div className="p-4">
          {/* Title and Location */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {trip.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate">{trip.location.name}</span>
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center mb-3">
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

          {/* Trip Details */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatDuration(trip.duration)}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Up to {trip.maxGuests}</span>
            </div>
          </div>

          {/* Boat Type and Fishing Types */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {trip.boatType}
              </span>
              {trip.fishingTypes.slice(0, 2).map((type, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {type}
                </span>
              ))}
              {trip.fishingTypes.length > 2 && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  +{trip.fishingTypes.length - 2} more
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-gray-100 gap-2">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              Starting from <span className="font-semibold text-gray-900">{formatPrice(trip.basePrice)}</span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium px-4 py-3 rounded-md transition-colors duration-200 touch-manipulation">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}