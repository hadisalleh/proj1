'use client';

import { Star } from 'lucide-react';
import StarRating from '../ui/StarRating';

interface ReviewStatsProps {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  className?: string;
}

export default function ReviewStats({
  totalReviews,
  averageRating,
  ratingDistribution,
  className = '',
}: ReviewStatsProps) {
  if (totalReviews === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 text-center ${className}`}>
        <div className="text-gray-400 text-4xl mb-2">⭐</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No reviews yet</h3>
        <p className="text-gray-600">Be the first to review this trip!</p>
      </div>
    );
  }

  const getPercentage = (count: number) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            <StarRating rating={averageRating} size="md" />
            <span className="text-2xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating as keyof typeof ratingDistribution];
          const percentage = getPercentage(count);
          
          return (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-12">
                <span className="text-sm font-medium text-gray-700">{rating}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              </div>
              
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex items-center space-x-2 w-16 text-right">
                <span className="text-sm text-gray-600">{count}</span>
                <span className="text-xs text-gray-500">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {getPercentage(ratingDistribution[5] + ratingDistribution[4])}%
            </div>
            <div className="text-sm text-gray-600">Positive reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {averageRating >= 4.5 ? '⭐' : averageRating >= 4.0 ? '👍' : averageRating >= 3.0 ? '👌' : '📝'}
            </div>
            <div className="text-sm text-gray-600">
              {averageRating >= 4.5 ? 'Excellent' : 
               averageRating >= 4.0 ? 'Very Good' : 
               averageRating >= 3.0 ? 'Good' : 
               'Fair'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}