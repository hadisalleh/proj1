'use client';

import { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  enabled?: boolean;
  threshold?: number;
  className?: string;
}

export default function PullToRefresh({
  onRefresh,
  children,
  enabled = true,
  threshold = 80,
  className = ''
}: PullToRefreshProps) {
  const {
    containerRef,
    isRefreshing,
    pullDistance,
    shouldShowRefreshIndicator,
    refreshProgress
  } = usePullToRefresh({
    onRefresh,
    threshold,
    enabled
  });

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{
        transform: shouldShowRefreshIndicator ? `translateY(${Math.min(pullDistance, threshold)}px)` : 'none',
        transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      {/* Refresh Indicator */}
      {shouldShowRefreshIndicator && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-blue-50 border-b border-blue-200 z-10"
          style={{
            height: `${Math.min(pullDistance, threshold)}px`,
            transform: `translateY(-${Math.min(pullDistance, threshold)}px)`
          }}
        >
          <div className="flex items-center space-x-2 text-blue-600">
            <RefreshCw
              className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`}
              style={{
                transform: `rotate(${refreshProgress * 360}deg)`
              }}
            />
            <span className="text-sm font-medium">
              {isRefreshing ? 'Refreshing...' : pullDistance >= threshold ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
}