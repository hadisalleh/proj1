'use client';

import { ReactNode } from 'react';
import { usePerformanceOptimization, useWebVitals } from '@/hooks/usePerformanceOptimization';

interface PerformanceProviderProps {
  children: ReactNode;
}

export default function PerformanceProvider({ children }: PerformanceProviderProps) {
  // Initialize performance optimizations
  usePerformanceOptimization();
  useWebVitals();

  return <>{children}</>;
}