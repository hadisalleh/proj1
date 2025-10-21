'use client';

import { useState } from 'react';
import { Upload, X, Star, Calendar, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import StarRating from '../ui/StarRating';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ReviewSubmissionFormProps {
  tripId: string;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

interface ReviewFormData {
  rating: number;
  comment: string;
  tripDate: string;
  images: File[];
}

export default function ReviewSubmissionForm({
  tripId,
  onSubmitSuccess,
  onCancel,
  className = '',
}: ReviewSubmissionFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    comment: '',
    tripDate: '',
    images: [],
  });
  
  const [errors, setErrors] = useState<Partial<ReviewFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ReviewFormData> = {};

    if (formData.rating === 0) {
      newErrors.rating = 1; // Use number for rating errors
    }

    if (!formData.tripDate) {
      newErrors.tripDate = 'Trip date is required';
    } else {
      const tripDate = new Date(formData.tripDate);
      const today = new Date();
      if (tripDate > today) {
        newErrors.tripDate = 'Trip date cannot be in the future';
      }
    }

    if (formData.comment.trim().length === 0) {
      newErrors.comment = 'Please share your experience';
    } else if (formData.comment.length > 1000) {
      newErrors.comment = 'Comment must be less than 1000 characters';
    }

    if (formData.images.length > 5) {
      newErrors.images = [] as any; // Indicate image error
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const comment = e.target.value;
    setFormData(prev => ({ ...prev, comment }));
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: undefined }));
    }
  };

  const handleTripDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tripDate = e.target.value;
    setFormData(prev => ({ ...prev, tripDate }));
    if (errors.tripDate) {
      setErrors(prev => ({ ...prev, tripDate: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (formData.images.length + files.length > 5) {
      setErrors(prev => ({ ...prev, images: [] as any }));
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Please upload only image files under 5MB each');
      return;
    }

    const newImages = [...formData.images, ...validFiles];
    setFormData(prev => ({ ...prev, images: newImages }));

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);

    if (errors.images) {
      setErrors(prev => ({ ...prev, images: undefined }));
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('rating', formData.rating.toString());
      submitData.append('comment', formData.comment.trim());
      submitData.append('tripDate', formData.tripDate);
      
      formData.images.forEach((image, index) => {
        submitData.append(`images`, image);
      });

      const response = await fetch(`/api/trips/${tripId}/reviews`, {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      // Show success state
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        rating: 0,
        comment: '',
        tripDate: '',
        images: [],
      });
      setImagePreviewUrls([]);
      setErrors({});

      // Call success callback after a delay
      setTimeout(() => {
        setShowSuccess(false);
        onSubmitSuccess?.();
      }, 2000);

    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (showSuccess) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
        <div className="text-green-600 text-5xl mb-4">✅</div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">Review Submitted!</h3>
        <p className="text-green-700">Thank you for sharing your experience. Your review will help other travelers.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Share Your Experience
        </h3>

        {/* Rating */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Overall Rating *
          </label>
          <div className="flex items-center space-x-3">
            <StarRating
              rating={formData.rating}
              interactive
              onRatingChange={handleRatingChange}
              size="lg"
            />
            <span className="text-sm text-gray-600">
              {formData.rating === 0 ? 'Select a rating' : `${formData.rating} star${formData.rating !== 1 ? 's' : ''}`}
            </span>
          </div>
          {errors.rating && (
            <p className="text-red-600 text-sm">Please select a rating</p>
          )}
        </div>

        {/* Trip Date */}
        <div className="space-y-2 mb-6">
          <label htmlFor="tripDate" className="block text-sm font-medium text-gray-700">
            <Calendar className="h-4 w-4 inline mr-1" />
            Trip Date *
          </label>
          <input
            type="date"
            id="tripDate"
            value={formData.tripDate}
            onChange={handleTripDateChange}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.tripDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.tripDate && (
            <p className="text-red-600 text-sm">{errors.tripDate}</p>
          )}
        </div>

        {/* Comment */}
        <div className="space-y-2 mb-6">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Your Review *
          </label>
          <textarea
            id="comment"
            rows={4}
            value={formData.comment}
            onChange={handleCommentChange}
            placeholder="Tell us about your fishing trip experience..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.comment ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{errors.comment && <span className="text-red-600">{errors.comment}</span>}</span>
            <span>{formData.comment.length}/1000</span>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-gray-700">
            <Upload className="h-4 w-4 inline mr-1" />
            Photos (Optional)
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Add up to 5 photos to showcase your experience (max 5MB each)
          </p>
          
          {/* Image Previews */}
          {imagePreviewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {formData.images.length < 5 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to upload photos or drag and drop
                </span>
              </label>
            </div>
          )}
          
          {errors.images && (
            <p className="text-red-600 text-sm">Maximum 5 images allowed</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting && <LoadingSpinner size="sm" />}
            <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}