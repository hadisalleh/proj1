'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

type SortOption = 'createdAt' | 'price' | 'rating' | 'duration' | 'popularity';

interface SortDropdownProps {
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: SortOption, sortOrder: 'asc' | 'desc') => void;
}

const sortOptions = [
  { value: 'createdAt', label: 'Newest First', order: 'desc' as const },
  { value: 'createdAt', label: 'Oldest First', order: 'asc' as const },
  { value: 'price', label: 'Price: Low to High', order: 'asc' as const },
  { value: 'price', label: 'Price: High to Low', order: 'desc' as const },
  { value: 'rating', label: 'Highest Rated', order: 'desc' as const },
  { value: 'popularity', label: 'Most Popular', order: 'desc' as const },
  { value: 'duration', label: 'Duration: Short to Long', order: 'asc' as const },
  { value: 'duration', label: 'Duration: Long to Short', order: 'desc' as const },
];

export default function SortDropdown({ sortBy, sortOrder, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = sortOptions.find(
    option => option.value === sortBy && option.order === sortOrder
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionSelect = (option: typeof sortOptions[0]) => {
    onSortChange(option.value as SortOption, option.order);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span>Sort: {currentOption?.label || 'Newest First'}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            {sortOptions.map((option, index) => {
              const isSelected = option.value === sortBy && option.order === sortOrder;
              
              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                    isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}