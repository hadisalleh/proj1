'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  CheckCircle, 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  Download,
  Share2,
  ArrowLeft
} from 'lucide-react';
import { BookingResult } from '@/lib/services/bookingService';

interface BookingConfirmationProps {
  booking: BookingResult;
}

export default function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const [isSharing, setIsSharing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${hours} hours`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days} days ${remainingHours} hours` : `${days} days`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmed';
      case 'PENDING':
        return 'Pending Confirmation';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Fishing Trip Booking - ${booking.trip.title}`,
          text: `I've booked a fishing trip: ${booking.trip.title} on ${formatDate(booking.startDate)}`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = () => {
    // This would typically generate a PDF or trigger a download
    // For now, we'll just print the page
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/trips"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to trips
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Your fishing trip has been successfully booked. We've sent a confirmation email to{' '}
            <span className="font-medium">{booking.customerInfo.email}</span>
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Header with Trip Image */}
          <div className="relative h-48 bg-gray-200">
            {booking.trip.images.length > 0 ? (
              <Image
                src={booking.trip.images[0]}
                alt={booking.trip.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-white text-6xl">🎣</div>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {getStatusText(booking.status)}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Booking Reference */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Booking Reference
                  </h2>
                  <p className="text-2xl font-mono font-bold text-blue-600">
                    #{booking.id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">🎣</div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.trip.title}</p>
                      <p className="text-sm text-gray-600">Fishing Trip</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{booking.trip.locationName}</p>
                      <p className="text-sm text-gray-600">Location</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{formatDuration(booking.trip.duration)}</p>
                      <p className="text-sm text-gray-600">Duration</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-lg mr-3 mt-0.5">⛵</div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.trip.boatType}</p>
                      <p className="text-sm text-gray-600">Boat Type</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDate(booking.startDate)}
                        {booking.endDate && booking.endDate !== booking.startDate && 
                          ` - ${formatDate(booking.endDate)}`
                        }
                      </p>
                      <p className="text-sm text-gray-600">Trip Date{booking.endDate && booking.endDate !== booking.startDate ? 's' : ''}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                      </p>
                      <p className="text-sm text-gray-600">Party Size</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-lg mr-3 mt-0.5">💰</div>
                    <div>
                      <p className="font-medium text-gray-900">{formatPrice(booking.totalPrice)}</p>
                      <p className="text-sm text-gray-600">Total Amount</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDate(booking.createdAt)}
                      </p>
                      <p className="text-sm text-gray-600">Booking Date</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="text-lg mr-3">👤</div>
                  <div>
                    <p className="font-medium text-gray-900">{booking.customerInfo.name}</p>
                    <p className="text-sm text-gray-600">Name</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{booking.customerInfo.email}</p>
                    <p className="text-sm text-gray-600">Email</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{booking.customerInfo.phone}</p>
                    <p className="text-sm text-gray-600">Phone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
          <div className="space-y-2 text-blue-800">
            <p>• You'll receive a confirmation email with all the details</p>
            <p>• We'll contact you 24 hours before your trip with final instructions</p>
            <p>• Please arrive 15 minutes early at the departure location</p>
            <p>• Don't forget to bring sunscreen, hat, and comfortable clothing</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/trips"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Browse More Trips
          </Link>
          <Link
            href={`/trips/${booking.trip.id}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            View Trip Details
          </Link>
        </div>
      </div>
    </div>
  );
}