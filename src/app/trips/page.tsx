import { Suspense } from 'react';
import TripListingClient from '@/components/features/TripListingClient';

export default function TripsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <TripListingClient />
      </Suspense>
    </div>
  );
}