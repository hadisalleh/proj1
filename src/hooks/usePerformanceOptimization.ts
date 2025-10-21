'use client';

import { useEffect, useCallback } from 'react';
import { performanceMonitor } from '@/utils/performance';

export function usePerformanceOptimization() {
  // Preload critical resources
  const preloadResource = useCallback((href: string, as: string) => {
    if (typeof window === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }, []);

  // Prefetch next page resources
  const prefetchPage = useCallback((href: string) => {
    if (typeof window === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }, []);

  // Optimize images with intersection observer
  const optimizeImages = useCallback(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });

    return () => imageObserver.disconnect();
  }, []);

  // Reduce main thread blocking
  const scheduleWork = useCallback((callback: () => void) => {
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      (window as any).scheduler.postTask(callback, { priority: 'background' });
    } else if ('requestIdleCallback' in window) {
      requestIdleCallback(callback);
    } else {
      setTimeout(callback, 0);
    }
  }, []);

  // Memory cleanup
  const cleanupMemory = useCallback(() => {
    // Clear performance metrics older than 10 minutes
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const metrics = performanceMonitor.getMetrics();
    const recentMetrics = metrics.filter(metric => metric.timestamp > tenMinutesAgo);
    
    if (recentMetrics.length < metrics.length) {
      performanceMonitor.clearMetrics();
      recentMetrics.forEach(metric => {
        performanceMonitor.recordMetric(metric.name, metric.duration);
      });
    }

    // Suggest garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      scheduleWork(() => {
        try {
          (window as any).gc();
        } catch (e) {
          // Ignore errors
        }
      });
    }
  }, [scheduleWork]);

  // Initialize performance optimizations
  useEffect(() => {
    // Optimize images on mount
    const cleanup = optimizeImages();

    // Schedule periodic memory cleanup
    const memoryCleanupInterval = setInterval(cleanupMemory, 5 * 60 * 1000); // Every 5 minutes

    // Preload critical fonts
    preloadResource('/fonts/geist-sans.woff2', 'font');
    preloadResource('/fonts/geist-mono.woff2', 'font');

    return () => {
      cleanup?.();
      clearInterval(memoryCleanupInterval);
    };
  }, [optimizeImages, cleanupMemory, preloadResource]);

  return {
    preloadResource,
    prefetchPage,
    scheduleWork,
    cleanupMemory
  };
}

// Hook for monitoring Core Web Vitals
export function useWebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Monitor and report web vitals
    const reportWebVital = (metric: any) => {
      performanceMonitor.recordMetric(metric.name, metric.value);
      
      // Log poor performance in development
      if (process.env.NODE_ENV === 'development') {
        const thresholds = {
          CLS: 0.1,
          FID: 100,
          FCP: 1800,
          LCP: 2500,
          TTFB: 800
        };
        
        const threshold = thresholds[metric.name as keyof typeof thresholds];
        if (threshold && metric.value > threshold) {
          console.warn(`Poor ${metric.name}: ${metric.value} (threshold: ${threshold})`);
        }
      }
    };

    // Use basic performance API
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            reportWebVital({
              name: entry.entryType,
              value: entry.startTime,
              id: Math.random().toString(36).substr(2, 9)
            });
          }
        });
        
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
      } catch (e) {
        console.warn('Performance observer not supported');
      }
    }
  }, []);
}