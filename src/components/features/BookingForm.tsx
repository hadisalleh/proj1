'use client';

import { useState } from 'react';
import { Calendar, Users, Clock, AlertCircle, Check } from 'lucide-react';
import { TripSearchResult } from '@/lib/services/tripService';

interface BookingFormProps {
  trip: TripSearchResult;
}

interface BookingFormData {
  startDate: string;
  endDate: string;
  guests: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function BookingForm({ trip }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    startDate: '',
    endDate: '',
    guests: 1,
    customerInfo: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'unavailable' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'dates' | 'details' | 'confirmation'>('dates');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotal = () => {
    return trip.basePrice * formData.guests;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('customerInfo.')) {
      const customerField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          [customerField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const checkAvailability = async () => {
    if (!formData.startDate || !formData.guests) return;

    setIsCheckingAvailability(true);
    setAvailabilityStatus(null);

    try {
      const response = await fetch('/api/bookings/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: trip.id,
          startDate: formData.startDate,
          endDate: formData.endDate || formData.startDate,
          guests: formData.guests,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setAvailabilityStatus(data.available ? 'available' : 'unavailable');
      } else {
        setErrors({ general: data.error || 'Failed to check availability' });
      }
    } catch (error) {
      setErrors({ general: 'Failed to check availability. Please try again.' });
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const validateDatesStep = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.guests < 1) {
      newErrors.guests = 'At least 1 guest is required';
    }

    if (formData.guests > trip.maxGuests) {
      newErrors.guests = `Maximum ${trip.maxGuests} guests allowed`;
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDetailsStep = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerInfo.name.trim()) {
      newErrors['customerInfo.name'] = 'Name is required';
    }

    if (!formData.customerInfo.email.trim()) {
      newErrors['customerInfo.email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerInfo.email)) {
      newErrors['customerInfo.email'] = 'Please enter a valid email';
    }

    if (!formData.customerInfo.phone.trim()) {
      newErrors['customerInfo.phone'] = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (step === 'dates') {
      if (validateDatesStep()) {
        await checkAvailability();
        if (availabilityStatus === 'available') {
          setStep('details');
        }
      }
    } else if (step === 'details') {
      if (validateDetailsStep()) {
        setStep('confirmation');
      }
    }
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: trip.id,
          startDate: formData.startDate,
          endDate: formData.endDate || formData.startDate,
          guests: formData.guests,
          customerInfo: formData.customerInfo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to booking confirmation page
        window.location.href = `/bookings/${data.bookingId}/confirmation`;
      } else {
        setErrors({ general: data.error || 'Failed to create booking' });
      }
    } catch (error) {
      setErrors({ general: 'Failed to create booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(trip.basePrice)}
          </span>
          <span className="text-gray-600">per person</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-1" />
          <span>{trip.duration < 24 ? `${trip.duration} hours` : `${Math.floor(trip.duration / 24)} days`}</span>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className={`flex items-center ${step === 'dates' ? 'text-blue-600' : step === 'details' || step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'dates' ? 'bg-blue-100 text-blue-600' : 
            step === 'details' || step === 'confirmation' ? 'bg-green-100 text-green-600' : 
            'bg-gray-100 text-gray-400'
          }`}>
            {step === 'details' || step === 'confirmation' ? <Check className="h-4 w-4" /> : '1'}
          </div>
          <span className="ml-2 text-sm font-medium">Dates</span>
        </div>
        
        <div className={`flex items-center ${step === 'details' ? 'text-blue-600' : step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'details' ? 'bg-blue-100 text-blue-600' : 
            step === 'confirmation' ? 'bg-green-100 text-green-600' : 
            'bg-gray-100 text-gray-400'
          }`}>
            {step === 'confirmation' ? <Check className="h-4 w-4" /> : '2'}
          </div>
          <span className="ml-2 text-sm font-medium">Details</span>
        </div>
        
        <div className={`flex items-center ${step === 'confirmation' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'confirmation' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
          }`}>
            3
          </div>
          <span className="ml-2 text-sm font-medium">Book</span>
        </div>
      </div>

      {/* Step Content */}
      {step === 'dates' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                min={getTomorrowDate()}
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                min={formData.startDate || getTomorrowDate()}
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={formData.guests}
                onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.guests ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {Array.from({ length: trip.maxGuests }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
            {errors.guests && (
              <p className="mt-1 text-sm text-red-600">{errors.guests}</p>
            )}
          </div>

          {/* Availability Status */}
          {availabilityStatus === 'unavailable' && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">
                Sorry, this trip is not available for the selected dates.
              </span>
            </div>
          )}

          {availabilityStatus === 'available' && (
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700 text-sm">
                Great! This trip is available for your selected dates.
              </span>
            </div>
          )}

          <button
            onClick={handleNextStep}
            disabled={isCheckingAvailability || availabilityStatus === 'unavailable'}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isCheckingAvailability ? 'Checking Availability...' : 'Check Availability'}
          </button>
        </div>
      )}

      {step === 'details' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.customerInfo.name}
              onChange={(e) => handleInputChange('customerInfo.name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors['customerInfo.name'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors['customerInfo.name'] && (
              <p className="mt-1 text-sm text-red-600">{errors['customerInfo.name']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.customerInfo.email}
              onChange={(e) => handleInputChange('customerInfo.email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors['customerInfo.email'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email address"
            />
            {errors['customerInfo.email'] && (
              <p className="mt-1 text-sm text-red-600">{errors['customerInfo.email']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.customerInfo.phone}
              onChange={(e) => handleInputChange('customerInfo.phone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors['customerInfo.phone'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
            {errors['customerInfo.phone'] && (
              <p className="mt-1 text-sm text-red-600">{errors['customerInfo.phone']}</p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setStep('dates')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 'confirmation' && (
        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Booking Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Trip:</span>
                <span className="font-medium">{trip.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(formData.startDate).toLocaleDateString()}
                  {formData.endDate && formData.endDate !== formData.startDate && 
                    ` - ${new Date(formData.endDate).toLocaleDateString()}`
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">{formData.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{formData.customerInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.customerInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{formData.customerInfo.phone}</span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {formatPrice(trip.basePrice)} × {formData.guests} {formData.guests === 1 ? 'guest' : 'guests'}
              </span>
              <span className="font-medium">{formatPrice(calculateTotal())}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
          </div>

          {errors.general && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{errors.general}</span>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setStep('details')}
              disabled={isSubmitting}
              className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmitBooking}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}