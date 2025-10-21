// Simple in-memory cache for client-side caching
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const isExpired = Date.now() - item.timestamp > item.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  size(): number {
    return this.cache.size;
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const cache = new MemoryCache();

// Cache key generators
export const cacheKeys = {
  trips: (params: Record<string, any>) => `trips:${JSON.stringify(params)}`,
  trip: (id: string) => `trip:${id}`,
  reviews: (tripId: string, params?: Record<string, any>) => 
    `reviews:${tripId}:${params ? JSON.stringify(params) : 'all'}`,
  bookings: (userId: string) => `bookings:${userId}`,
  user: (id: string) => `user:${id}`,
};

// Cached fetch wrapper
export async function cachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlMs: number = 5 * 60 * 1000
): Promise<T> {
  // Check cache first
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  // Fetch and cache
  const data = await fetchFn();
  cache.set(key, data, ttlMs);
  
  return data;
}

// Debounced cache cleanup (run every 5 minutes)
let cleanupTimer: NodeJS.Timeout | null = null;

export function scheduleCleanup(): void {
  if (cleanupTimer) {
    clearTimeout(cleanupTimer);
  }
  
  cleanupTimer = setTimeout(() => {
    cache.cleanup();
    scheduleCleanup(); // Schedule next cleanup
  }, 5 * 60 * 1000); // 5 minutes
}

// Initialize cleanup on first import
if (typeof window !== 'undefined') {
  scheduleCleanup();
}