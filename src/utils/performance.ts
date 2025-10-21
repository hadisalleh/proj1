// Performance monitoring utilities

export interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers(): void {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.recordMetric('page-load', navEntry.loadEventEnd - navEntry.fetchStart);
              this.recordMetric('dom-content-loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart);
              this.recordMetric('first-paint', navEntry.loadEventEnd - navEntry.fetchStart);
            }
          }
        });
        
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);
      } catch (e) {
        console.warn('Navigation timing observer not supported');
      }

      // Observe largest contentful paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('largest-contentful-paint', lastEntry.startTime);
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // Observe first input delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('first-input-delay', entry.processingStart - entry.startTime);
          }
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Observe cumulative layout shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.recordMetric('cumulative-layout-shift', clsValue);
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  recordMetric(name: string, duration: number): void {
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now()
    });

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${name} - ${duration.toFixed(2)}ms`);
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getMetricsByName(name: string): PerformanceMetrics[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  getAverageMetric(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.duration, 0);
    return sum / metrics.length;
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for measuring custom operations
export function measureAsync<T>(
  name: string,
  asyncFn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  
  return asyncFn().finally(() => {
    const duration = performance.now() - start;
    performanceMonitor.recordMetric(name, duration);
  });
}

export function measureSync<T>(
  name: string,
  syncFn: () => T
): T {
  const start = performance.now();
  
  try {
    return syncFn();
  } finally {
    const duration = performance.now() - start;
    performanceMonitor.recordMetric(name, duration);
  }
}

// Web Vitals thresholds
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 },   // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
};

export function getWebVitalsScore(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[metricName as keyof typeof WEB_VITALS_THRESHOLDS];
  if (!thresholds) return 'good';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}