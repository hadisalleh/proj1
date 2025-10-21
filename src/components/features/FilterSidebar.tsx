'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react';
import { SearchFilters } from '@/types';
// import { useSwipeableElement } from '@/hooks/useSwipeGesture';

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

interface FilterSection {
  id: string;
  title: string;
  isOpen: boolean;
}

const boatTypes = [
  'Charter Boat',
  'Sport Fishing Boat',
  'Deep Sea Vessel',
  'Catamaran',
  'Yacht',
  'Pontoon Boat',
  'Kayak',
  'Shore Fishing',
];

const fishingTypes = [
  'Deep Sea Fishing',
  'Inshore Fishing',
  'Fly Fishing',
  'Trolling',
  'Bottom Fishing',
  'Spearfishing',
  'Ice Fishing',
  'Surf Fishing',
];

const durationOptions = [
  { label: 'Half Day (4-6 hours)', value: [4, 6] },
  { label: 'Full Day (8-10 hours)', value: [8, 10] },
  { label: 'Multi-Day (24+ hours)', value: [24, 168] }, // Up to 1 week
  { label: 'Week Long (168+ hours)', value: [168, 720] }, // Up to 1 month
];

export default function FilterSidebar({
  filters,
  onFiltersChange,
  isOpen = true,
  onToggle,
  className = '',
}: FilterSidebarProps) {
  const [sections, setSections] = useState<FilterSection[]>([
    { id: 'price', title: 'Price Range', isOpen: true },
    { id: 'boatType', title: 'Boat Type', isOpen: true },
    { id: 'fishingType', title: 'Fishing Type', isOpen: false },
    { id: 'duration', title: 'Trip Duration', isOpen: false },
  ]);

  const [priceRange, setPriceRange] = useState<[number, number]>(
    filters.priceRange || [0, 5000]
  );

  useEffect(() => {
    if (filters.priceRange) {
      setPriceRange(filters.priceRange);
    }
  }, [filters.priceRange]);

  const toggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, isOpen: !section.isOpen }
          : section
      )
    );
  };

  const handlePriceRangeChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = value;
    
    // Ensure min doesn't exceed max and vice versa
    if (index === 0 && value > newRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < newRange[0]) {
      newRange[0] = value;
    }
    
    setPriceRange(newRange);
    onFiltersChange({
      ...filters,
      priceRange: newRange,
    });
  };

  const handleBoatTypeChange = (boatType: string, checked: boolean) => {
    const currentBoatTypes = filters.boatType || [];
    const newBoatTypes = checked
      ? [...currentBoatTypes, boatType]
      : currentBoatTypes.filter(type => type !== boatType);

    onFiltersChange({
      ...filters,
      boatType: newBoatTypes.length > 0 ? newBoatTypes : undefined,
    });
  };

  const handleFishingTypeChange = (fishingType: string, checked: boolean) => {
    const currentFishingTypes = filters.fishingType || [];
    const newFishingTypes = checked
      ? [...currentFishingTypes, fishingType]
      : currentFishingTypes.filter(type => type !== fishingType);

    onFiltersChange({
      ...filters,
      fishingType: newFishingTypes.length > 0 ? newFishingTypes : undefined,
    });
  };

  const handleDurationChange = (durationRange: number[], checked: boolean) => {
    const currentDurations = filters.duration || [];
    const newDurations = checked
      ? [...currentDurations, ...durationRange]
      : currentDurations.filter(d => !durationRange.includes(d));

    onFiltersChange({
      ...filters,
      duration: newDurations.length > 0 ? newDurations : undefined,
    });
  };

  const clearAllFilters = () => {
    setPriceRange([0, 5000]);
    onFiltersChange({});
  };

  const hasActiveFilters = () => {
    return (
      filters.priceRange ||
      (filters.boatType && filters.boatType.length > 0) ||
      (filters.fishingType && filters.fishingType.length > 0) ||
      (filters.duration && filters.duration.length > 0)
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceRange) count++;
    if (filters.boatType && filters.boatType.length > 0) count++;
    if (filters.fishingType && filters.fishingType.length > 0) count++;
    if (filters.duration && filters.duration.length > 0) count++;
    return count;
  };

  const sidebarContent = (
    <div className="bg-white border-r border-gray-200 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {hasActiveFilters() && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          {onToggle && (
            <button
              onClick={onToggle}
              className="md:hidden p-1 rounded-md hover:bg-gray-100"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {hasActiveFilters() && (
          <button
            onClick={clearAllFilters}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Price Range */}
        {sections.find(s => s.id === 'price') && (
          <div>
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left py-2 touch-manipulation"
            >
              <h3 className="text-base font-medium text-gray-900">Price Range</h3>
              {sections.find(s => s.id === 'price')?.isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {sections.find(s => s.id === 'price')?.isOpen && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Min</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-base border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 touch-manipulation"
                      min="0"
                      max="10000"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Max</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-base border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 touch-manipulation"
                      min="0"
                      max="10000"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="text-xs text-gray-600 text-center">
                  ${priceRange[0]} - ${priceRange[1]}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Boat Type */}
        {sections.find(s => s.id === 'boatType') && (
          <div>
            <button
              onClick={() => toggleSection('boatType')}
              className="flex items-center justify-between w-full text-left py-2 touch-manipulation"
            >
              <h3 className="text-base font-medium text-gray-900">Boat Type</h3>
              {sections.find(s => s.id === 'boatType')?.isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {sections.find(s => s.id === 'boatType')?.isOpen && (
              <div className="mt-3 space-y-2">
                {boatTypes.map((boatType) => (
                  <label key={boatType} className="flex items-center py-1 touch-manipulation">
                    <input
                      type="checkbox"
                      checked={filters.boatType?.includes(boatType) || false}
                      onChange={(e) => handleBoatTypeChange(boatType, e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 touch-manipulation"
                    />
                    <span className="ml-3 text-base text-gray-700">{boatType}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Fishing Type */}
        {sections.find(s => s.id === 'fishingType') && (
          <div>
            <button
              onClick={() => toggleSection('fishingType')}
              className="flex items-center justify-between w-full text-left py-2 touch-manipulation"
            >
              <h3 className="text-base font-medium text-gray-900">Fishing Type</h3>
              {sections.find(s => s.id === 'fishingType')?.isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {sections.find(s => s.id === 'fishingType')?.isOpen && (
              <div className="mt-3 space-y-2">
                {fishingTypes.map((fishingType) => (
                  <label key={fishingType} className="flex items-center py-1 touch-manipulation">
                    <input
                      type="checkbox"
                      checked={filters.fishingType?.includes(fishingType) || false}
                      onChange={(e) => handleFishingTypeChange(fishingType, e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 touch-manipulation"
                    />
                    <span className="ml-3 text-base text-gray-700">{fishingType}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Duration */}
        {sections.find(s => s.id === 'duration') && (
          <div>
            <button
              onClick={() => toggleSection('duration')}
              className="flex items-center justify-between w-full text-left py-2 touch-manipulation"
            >
              <h3 className="text-base font-medium text-gray-900">Trip Duration</h3>
              {sections.find(s => s.id === 'duration')?.isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {sections.find(s => s.id === 'duration')?.isOpen && (
              <div className="mt-3 space-y-2">
                {durationOptions.map((option, index) => (
                  <label key={index} className="flex items-center py-1 touch-manipulation">
                    <input
                      type="checkbox"
                      checked={
                        filters.duration?.some(d => option.value.includes(d)) || false
                      }
                      onChange={(e) => handleDurationChange(option.value, e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 touch-manipulation"
                    />
                    <span className="ml-3 text-base text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Mobile drawer
  if (onToggle) {
    return (
      <>
        {/* Mobile backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onToggle}
          />
        )}
        
        {/* Mobile drawer */}
        <div
          className={`fixed left-0 top-0 h-full w-full max-w-sm z-50 transform transition-transform duration-300 md:relative md:transform-none md:w-full ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } ${className}`}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={`w-80 ${className}`}>
      {sidebarContent}
    </div>
  );
}