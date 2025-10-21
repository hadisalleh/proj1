'use client';

import { useState } from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import ReviewList from './ReviewList';
import ReviewSubmissionForm from './ReviewSubmissionForm';

interface ReviewSectionProps {
  tripId: string;
  className?: string;
  allowSubmission?: boolean;
}

export default function ReviewSection({ 
  tripId, 
  className = '',
  allowSubmission = true 
}: ReviewSectionProps) {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmissionSuccess = () => {
    setShowSubmissionForm(false);
    // Trigger a refresh of the review list
    setRefreshKey(prev => prev + 1);
  };

  const handleCancelSubmission = () => {
    setShowSubmissionForm(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
        </div>
        
        {allowSubmission && !showSubmissionForm && (
          <button
            onClick={() => setShowSubmissionForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Write a Review</span>
          </button>
        )}
      </div>

      {/* Review Submission Form */}
      {showSubmissionForm && (
        <div className="mb-8">
          <ReviewSubmissionForm
            tripId={tripId}
            onSubmitSuccess={handleSubmissionSuccess}
            onCancel={handleCancelSubmission}
          />
        </div>
      )}

      {/* Reviews List */}
      <ReviewList 
        key={refreshKey} 
        tripId={tripId} 
      />
    </div>
  );
}