'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

interface SearchFormData {
  location: string;
  startDate: string;
  endDate: string;
  guests: number;
}

interface HeroSearchProps {
  onSearch?: (data: SearchFormData) => void;
}

// Mock location data for autocomplete
const mockLocations = [
  'Miami, Florida',
  'Key West, Florida',
  'San Diego, California',
  'Cabo San Lucas, Mexico',
  'Bahamas',
  'Costa Rica',
  'Alaska',
  'Hawaii',
  'Outer Banks, North Carolina',
  'Martha\'s Vineyard, Massachusetts',
];

export default function HeroSearch({ onSearch }: HeroSearchProps) {
  const [formData, setFormData] = useState<SearchFormData>({
    location: '',
    startDate: '',
    endDate: '',
    guests: 2,
  });
  
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({ ...prev, location: value }));
    
    if (value.length > 0) {
      const filtered = mockLocations.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const selectLocation = (location: string) => {
    setFormData(prev => ({ ...prev, location }));
    setShowLocationSuggestions(false);
  };

  const handleStartDateChange = (date: string) => {
    setFormData(prev => ({ 
      ...prev, 
      startDate: date,
      // Clear end date if it's before the new start date
      endDate: prev.endDate && prev.endDate < date ? '' : prev.endDate
    }));
  };

  const handleGuestChange = (increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      guests: increment 
        ? Math.min(prev.guests + 1, 20) 
        : Math.max(prev.guests - 1, 1)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.location.trim()) {
      alert('Please select a location');
      return;
    }
    
    if (!formData.startDate) {
      alert('Please select a start date');
      return;
    }

    // Validate that start date is not in the past
    if (formData.startDate < today) {
      alert('Start date cannot be in the past');
      return;
    }

    // Validate end date if provided
    if (formData.endDate && formData.endDate < formData.startDate) {
      alert('End date must be after start date');
      return;
    }

    onSearch?.(formData);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Find Your Perfect Fishing Adventure
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto px-4">
            Discover amazing fishing trips around the world. Compare prices, read reviews, and book your next adventure.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Location Input */}
              <div className="relative">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                    onFocus={() => formData.location && setShowLocationSuggestions(true)}
                    placeholder="Where do you want to fish?"
                    className="w-full pl-10 pr-4 py-3 sm:py-4 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                    required
                  />
                </div>
                
                {/* Location Suggestions */}
                {showLocationSuggestions && filteredLocations.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredLocations.map((location, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectLocation(location)}
                        className="w-full text-left px-4 py-3 text-base hover:bg-gray-100 focus:bg-gray-100 focus:outline-none touch-manipulation"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    min={today}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                    required
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    min={formData.startDate || today}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleGuestChange(false)}
                      className="absolute left-10 top-2 sm:top-2.5 z-10 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-base font-medium touch-manipulation"
                      disabled={formData.guests <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="guests"
                      value={formData.guests}
                      readOnly
                      className="w-full pl-20 pr-14 py-3 sm:py-4 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center touch-manipulation"
                    />
                    <button
                      type="button"
                      onClick={() => handleGuestChange(true)}
                      className="absolute right-3 top-2 sm:top-2.5 z-10 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-base font-medium touch-manipulation"
                      disabled={formData.guests >= 20}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 text-base touch-manipulation"
              >
                <Search className="h-5 w-5" />
                <span>Search Fishing Trips</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}