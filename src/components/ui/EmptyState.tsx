'use client';

import { Search, Frown } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'search' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ 
  title, 
  description, 
  icon = 'search', 
  action 
}: EmptyStateProps) {
  const IconComponent = icon === 'search' ? Search : Frown;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">
        <IconComponent className="h-16 w-16 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}