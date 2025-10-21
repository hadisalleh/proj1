'use client';

import { useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true
}: PullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (!enabled || isRefreshing) return;
    
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;
    
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!enabled || isRefreshing || startY === 0) return;
    
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, (currentY - startY) / resistance);
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (!enabled || isRefreshing || pullDistance < threshold) {
      setPullDistance(0);
      setStartY(0);
      return;
    }

    setIsRefreshing(true);
    
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
      setStartY(0);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, isRefreshing, startY, pullDistance, threshold, resistance]);

  const shouldShowRefreshIndicator = pullDistance > 0 || isRefreshing;
  const refreshProgress = Math.min(pullDistance / threshold, 1);

  return {
    containerRef,
    isRefreshing,
    pullDistance,
    shouldShowRefreshIndicator,
    refreshProgress
  };
}