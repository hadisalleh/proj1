'use client';

import ReviewList from './ReviewList';

interface TripReviewsProps {
  tripId: string;
  className?: string;
}

export default function TripReviews({ tripId, className = '' }: TripReviewsProps) {
  return (
    <div className={className}>
      <ReviewList tripId={tripId} />
    </div>
  );
}