import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Lazy load components with loading states
export const LazyTripImageGallery = dynamic(
  () => import('@/components/features/TripImageGallery'),
  {
    loading: () => (
      <div className="h-64 sm:h-80 md:h-[500px] bg-gray-200 animate-pulse flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    ),
    ssr: false
  }
);

export const LazyBookingForm = dynamic(
  () => import('@/components/features/BookingForm'),
  {
    loading: () => (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <LoadingSpinner size="lg" />
      </div>
    ),
    ssr: false
  }
);

export const LazyReviewSection = dynamic(
  () => import('@/components/features/ReviewSection'),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    ),
    ssr: false
  }
);

export const LazyFilterSidebar = dynamic(
  () => import('@/components/features/FilterSidebar'),
  {
    loading: () => (
      <div className="w-80 bg-gray-200 animate-pulse">
        <LoadingSpinner />
      </div>
    ),
    ssr: false
  }
);

export const LazyTripGrid = dynamic(
  () => import('@/components/features/TripGrid'),
  {
    loading: () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
        ))}
      </div>
    ),
    ssr: false
  }
);

// Utility function for creating lazy components with custom loading
export function createLazyComponent<T = any>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  loadingComponent?: React.ComponentType
) {
  return dynamic(importFn, {
    loading: loadingComponent || (() => <LoadingSpinner />),
    ssr: false
  });
}