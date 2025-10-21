'use client';

import { Filter, SortAsc } from 'lucide-react';
import { useState } from 'react';

export type ReviewSortOption = 'newest' | 'oldest' | 'highest' | 'lowest';
export type ReviewFilterOption = 'all' | '5' | '4' | '3' | '2' | '1';

interface ReviewFiltersProps {
  sortBy: ReviewSortOption;
  filterBy: ReviewFilterOption;
  onSortChange: (sort: ReviewSortOption) => void;
  onFilterChange: (filter: ReviewFilterOption) => void;
  totalCount: number;
  className?: string;
}

export default function ReviewFilters({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
  totalCount,
  className = '',
}: ReviewFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'newest' as const, label: 'Newest first' },
    { value: 'oldest' as const, label: 'Oldest first' },
    { value: 'highest' as const, label: 'Highest rated' },
    { value: 'lowest' as const, label: 'Lowest rated' },
  ];

  const filterOptions = [
    { value: 'all' as const, label: 'All ratings' },
    { value: '5' as const, label: '5 stars' },
    { value: '4' as const, label: '4 stars' },
    { value: '3' as const, label: '3 stars' },
    { value: '2' as const, label: '2 stars' },
    { value: '1' as const, label: '1 star' },
  ];

  const getFilteredCount = () => {
    if (filterBy === 'all') return totalCount;
    return `${totalCount} (filtered)`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with count and toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {getFilteredCount()} {totalCount === 1 ? 'Review' : 'Reviews'}
        </h3>
        
        <div className="flex items-center space-x-3">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filters</span>
          </button>

          {/* Sort dropdown - always visible */}
          <div className="flex items-center space-x-2">
            <SortAsc className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as ReviewSortOption)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter options */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 flex items-center">
            Filter by rating:
          </span>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterBy === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active filters indicator */}
      {filterBy !== 'all' && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Active filter:</span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {filterOptions.find(f => f.value === filterBy)?.label}
            <button
              onClick={() => onFilterChange('all')}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        </div>
      )}
    </div>
  );
}