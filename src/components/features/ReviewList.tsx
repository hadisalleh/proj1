'use client';

import { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import ReviewFilters, { ReviewSortOption, ReviewFilterOption } from './ReviewFilters';
import ReviewStats from './ReviewStats';
import LoadingSpinner from '../ui/LoadingSpinner';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  images?: string[];
  tripDate: Date;
  createdAt: Date;
  user: {
    name?: string;
    email: string;
  };
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface ReviewListProps {
  tripId: string;
  initialReviews?: Review[];
  className?: string;
}

export default function ReviewList({ 
  tripId, 
  initialReviews = [],
  className = '' 
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  
  // Filter and sort state
  const [sortBy, setSortBy] = useState<ReviewSortOption>('newest');
  const [filterBy, setFilterBy] = useState<ReviewFilterOption>('all');

  useEffect(() => {
    fetchReviews(1, true);
  }, [tripId, sortBy, filterBy]);

  const fetchReviews = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
        sortBy,
      });

      if (filterBy !== 'all') {
        params.append('rating', filterBy);
      }

      const response = await fetch(`/api/trips/${tripId}/reviews?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      
      if (reset || pageNum === 1) {
        setReviews(data.reviews);
      } else {
        setReviews(prev => [...prev, ...data.reviews]);
      }
      
      setHasMore(data.pagination.hasNextPage);
      setTotalCount(data.pagination.totalCount);
      setStats(data.stats);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchReviews(page + 1);
    }
  };

  const handleSortChange = (newSort: ReviewSortOption) => {
    setSortBy(newSort);
  };

  const handleFilterChange = (newFilter: ReviewFilterOption) => {
    setFilterBy(newFilter);
  };

  const handleRetry = () => {
    fetchReviews(1, true);
  };

  // Loading state for initial load
  if (loading && reviews.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && reviews.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load reviews</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (reviews.length === 0 && !loading) {
    return (
      <div className={`${className}`}>
        <ReviewFilters
          sortBy={sortBy}
          filterBy={filterBy}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
          totalCount={totalCount}
          className="mb-6"
        />
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filterBy === 'all' ? 'No reviews yet' : 'No reviews match your filter'}
          </h3>
          <p className="text-gray-600">
            {filterBy === 'all' 
              ? 'Be the first to share your experience with this trip!' 
              : 'Try adjusting your filter to see more reviews.'
            }
          </p>
          {filterBy !== 'all' && (
            <button
              onClick={() => handleFilterChange('all')}
              className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
            >
              Show all reviews
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Review Stats */}
      {stats && (
        <ReviewStats
          totalReviews={stats.totalReviews}
          averageRating={stats.averageRating}
          ratingDistribution={stats.ratingDistribution}
        />
      )}

      {/* Filters */}
      <ReviewFilters
        sortBy={sortBy}
        filterBy={filterBy}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        totalCount={totalCount}
      />

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            id={review.id}
            rating={review.rating}
            comment={review.comment}
            images={review.images}
            tripDate={review.tripDate}
            createdAt={review.createdAt}
            user={review.user}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {loading && <LoadingSpinner size="sm" />}
            <span>{loading ? 'Loading...' : 'Load More Reviews'}</span>
          </button>
        </div>
      )}

      {/* Loading indicator for additional pages */}
      {loading && reviews.length > 0 && (
        <div className="text-center py-4">
          <LoadingSpinner size="md" />
        </div>
      )}
    </div>
  );
}