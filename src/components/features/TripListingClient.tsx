'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import FilterSidebar from './FilterSidebar';
import TripGrid from './TripGrid';
import TripListView from './TripListView';
import SortDropdown from './SortDropdown';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import PullToRefresh from '@/components/ui/PullToRefresh';
import { SearchFilters, Trip } from '@/types';
import { TripSearchResult } from '@/lib/services/tripService';
import { cachedFetch, cacheKeys } from '@/utils/cache';
import { measureAsync } from '@/utils/performance';

interface SearchResponse {
  success: boolean;
  data: {
    trips: TripSearchResult[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters: {
      location: string;
      startDate: Date;
      endDate?: Date;
      guests: number;
      appliedFilters?: SearchFilters;
    };
  };
}

type ViewMode = 'grid' | 'list';
type SortOption = 'createdAt' | 'price' | 'rating' | 'duration' | 'popularity';

export default function TripListingClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // State management
  const [trips, setTrips] = useState<TripSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Search parameters from URL
  const location = searchParams.get('location') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const guests = parseInt(searchParams.get('guests') || '1');

  // Build search URL with current parameters
  const buildSearchUrl = useCallback((params: Record<string, any>) => {
    const url = new URL('/api/trips/search', window.location.origin);
    
    // Add base search parameters
    if (location) url.searchParams.set('location', location);
    if (startDate) url.searchParams.set('startDate', startDate);
    if (endDate) url.searchParams.set('endDate', endDate);
    if (guests) url.searchParams.set('guests', guests.toString());
    
    // Add filters
    if (filters.priceRange) {
      url.searchParams.set('priceRange', JSON.stringify(filters.priceRange));
    }
    if (filters.boatType && filters.boatType.length > 0) {
      url.searchParams.set('boatType', JSON.stringify(filters.boatType));
    }
    if (filters.fishingType && filters.fishingType.length > 0) {
      url.searchParams.set('fishingType', JSON.stringify(filters.fishingType));
    }
    if (filters.duration && filters.duration.length > 0) {
      url.searchParams.set('duration', JSON.stringify(filters.duration));
    }
    
    // Add pagination and sorting
    url.searchParams.set('page', params.page?.toString() || currentPage.toString());
    url.searchParams.set('limit', '12');
    url.searchParams.set('sortBy', params.sortBy || sortBy);
    url.searchParams.set('sortOrder', params.sortOrder || sortOrder);
    
    return url.toString();
  }, [location, startDate, endDate, guests, filters, currentPage, sortBy, sortOrder]);

  // Fetch trips from API with caching and performance monitoring
  const fetchTrips = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const url = buildSearchUrl({ page });
      const cacheKey = cacheKeys.trips({ url, page });
      
      const data: SearchResponse = await measureAsync('fetch-trips', () =>
        cachedFetch(
          cacheKey,
          async () => {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error('Failed to fetch trips');
            }
            return response.json();
          },
          2 * 60 * 1000 // Cache for 2 minutes
        )
      );
      
      if (data.success) {
        if (append) {
          setTrips(prev => [...prev, ...data.data.trips]);
        } else {
          setTrips(data.data.trips);
        }
        setCurrentPage(data.data.pagination.currentPage);
        setTotalPages(data.data.pagination.totalPages);
        setTotalCount(data.data.pagination.totalCount);
      } else {
        throw new Error('Search request failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [buildSearchUrl]);

  // Load more trips (infinite scroll)
  const loadMoreTrips = useCallback(() => {
    if (currentPage < totalPages && !loadingMore) {
      fetchTrips(currentPage + 1, true);
    }
  }, [currentPage, totalPages, loadingMore, fetchTrips]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Handle sort changes
  const handleSortChange = useCallback((newSortBy: SortOption, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  }, []);

  // Update URL when search parameters change
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    
    if (location) params.set('location', location);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (guests > 1) params.set('guests', guests.toString());
    
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [location, startDate, endDate, guests, pathname, router]);

  // Initial load and when dependencies change
  useEffect(() => {
    if (location || startDate || guests) {
      fetchTrips(1, false);
    }
  }, [fetchTrips]);

  // Update URL when search params change
  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMoreTrips();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreTrips]);

  // Show loading state for initial load
  if (loading && trips.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error state
  if (error && trips.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <EmptyState
          title="Something went wrong"
          description={error}
          action={{
            label: 'Try again',
            onClick: () => fetchTrips(1, false)
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Filter Sidebar */}
      <div className="lg:w-80 lg:flex-shrink-0">
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
          className="lg:sticky lg:top-0 lg:h-screen"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6 sticky top-16 z-40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4 order-2 sm:order-1">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
              >
                <Filter className="h-5 w-5" />
                <span className="text-base font-medium">Filters</span>
              </button>

              {/* Results count */}
              <div className="text-sm text-gray-600">
                {totalCount > 0 ? (
                  <>
                    Showing {trips.length} of {totalCount} trips
                    {location && (
                      <span className="ml-1">
                        in <span className="font-medium">{location}</span>
                      </span>
                    )}
                  </>
                ) : (
                  'No trips found'
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-start space-x-4 order-1 sm:order-2">
              {/* Sort dropdown */}
              <SortDropdown
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />

              {/* View mode toggle */}
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 touch-manipulation ${
                    viewMode === 'grid'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 touch-manipulation ${
                    viewMode === 'list'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Results */}
        <PullToRefresh
          onRefresh={() => fetchTrips(1, false)}
          className="flex-1"
          enabled={trips.length > 0}
        >
          <div className="p-4 lg:p-6">
            {trips.length === 0 ? (
              <EmptyState
                title="No trips found"
                description="Try adjusting your search criteria or filters to find more trips."
                action={{
                  label: 'Clear filters',
                  onClick: () => handleFiltersChange({})
                }}
              />
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <TripGrid trips={trips} />
                ) : (
                  <TripListView trips={trips} />
                )}

                {/* Loading more indicator */}
                {loadingMore && (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                )}

                {/* Load more button (fallback for infinite scroll) */}
                {currentPage < totalPages && !loadingMore && (
                  <div className="flex justify-center py-8">
                    <button
                      onClick={loadMoreTrips}
                      className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
                    >
                      Load More Trips
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </PullToRefresh>
      </div>
    </div>
  );
}