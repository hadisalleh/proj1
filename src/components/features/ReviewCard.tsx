'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import StarRating from '../ui/StarRating';

interface ReviewUser {
  name?: string;
  email: string;
}

interface ReviewCardProps {
  id: string;
  rating: number;
  comment?: string;
  images?: string[];
  tripDate: Date;
  createdAt: Date;
  user: ReviewUser;
}

export default function ReviewCard({
  id,
  rating,
  comment,
  images,
  tripDate,
  createdAt,
  user,
}: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const shouldTruncate = comment && comment.length > 300;
  const displayComment = shouldTruncate && !isExpanded 
    ? comment!.slice(0, 300) + '...'
    : comment;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  return (
    <>
      <div className="border-b border-gray-200 pb-6 last:border-b-0">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold text-sm">
              {getInitials(user.name, user.email)}
            </span>
          </div>

          {/* Review Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {user.name || 'Anonymous'}
                </h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Trip date: {formatDate(tripDate)}</span>
                  <span>•</span>
                  <span>{formatDate(createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-3">
              <StarRating rating={rating} showValue />
            </div>

            {/* Comment */}
            {comment && (
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {displayComment}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        Show less <ChevronUp className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Read more <ChevronDown className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Review Images */}
            {images && images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <div 
                    key={index} 
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(index)}
                  >
                    <Image
                      src={image}
                      alt={`Review image ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {index === 3 && images.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          +{images.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && images && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold z-10 hover:text-gray-300 transition-colors"
            >
              ×
            </button>
            <Image
              src={images[selectedImageIndex]}
              alt={`Review image ${selectedImageIndex + 1}`}
              width={800}
              height={600}
              className="object-contain max-h-[80vh] rounded-lg"
            />
            {images.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === selectedImageIndex ? 'bg-white' : 'bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}