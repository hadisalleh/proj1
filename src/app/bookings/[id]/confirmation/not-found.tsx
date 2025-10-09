import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function BookingNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
          <p className="text-gray-600">
            Sorry, we couldn't find the booking you're looking for. It may have been removed or the link might be incorrect.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/trips"
            className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <Search className="h-5 w-5 mr-2" />
            Browse Trips
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}