import { IMiddleware, IMiddlewareContext, IEnhancedMiddleware, IMiddlewareConfig } from '../IMiddleware';

interface CacheEntry {
  data: any;
  timestamp: Date;
  expiry: Date;
  key: string;
}

/**
 * Cache middleware for storing and retrieving cached data
 * Reduces API calls and improves performance
 */
export class CacheMiddleware<T extends object, S> implements IEnhancedMiddleware<T, S> {
  public readonly name = 'CacheMiddleware';
  public config: IMiddlewareConfig;
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL

  constructor(config: Partial<IMiddlewareConfig> & { defaultTTL?: number } = {}) {
    this.config = {
      enabled: true,
      priority: 10, // High priority, executes early
      includeActions: ['fetchTransactions', 'fetchBalance'],
      excludeActions: ['createTransaction', 'updateTransaction', 'deleteTransaction'],
      condition: this.cacheCondition.bind(this),
      ...config
    };

    if (config.defaultTTL) {
      this.defaultTTL = config.defaultTTL;
    }
  }

  execute(config: T): S {
    // This middleware doesn't modify the config directly
    // Cache logic is handled in the enhanced store methods
    return config as unknown as S;
  }

  updateConfig(config: Partial<IMiddlewareConfig>): void {
    this.config = { ...this.config, ...config };
  }

  shouldExecute(context: IMiddlewareContext): boolean {
    if (!this.config.enabled) return false;

    if (this.config.condition && !this.config.condition(context)) {
      return false;
    }

    return true;
  }

  /**
   * Check if data should be cached for this context
   */
  private cacheCondition(context: IMiddlewareContext): boolean {
    // Don't cache if there's no action
    if (!context.action) return false;

    // Don't cache if user is not authenticated (data is user-specific)
    const isUserAuthenticated = this.checkAuthentication();
    if (!isUserAuthenticated) return false;

    // Don't cache if request includes specific filters that change frequently
    const hasFrequentFilters = this.hasFrequentFilters(context);
    if (hasFrequentFilters) return false;

    return true;
  }

  /**
   * Get cached data for a key
   */
  get(key: string): any | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cached data
   */
  set(key: string, data: any, ttl?: number): void {
    const expiry = new Date();
    expiry.setTime(expiry.getTime() + (ttl || this.defaultTTL));

    this.cache.set(key, {
      data,
      timestamp: new Date(),
      expiry,
      key
    });

    // Clean up expired entries periodically
    this.cleanup();
  }

  /**
   * Delete cached data
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Generate cache key from parameters
   */
  generateCacheKey(action: string, params: Record<string, any> = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        if (params[key] !== undefined && params[key] !== null) {
          result[key] = Array.isArray(params[key])
            ? params[key].sort().join(',')
            : params[key];
        }
        return result;
      }, {} as Record<string, any>);

    const paramString = JSON.stringify(sortedParams);
    return `${action}_${btoa(paramString).replace(/[^a-zA-Z0-9]/g, '')}`;
  }

  /**
   * Invalidate cache for specific patterns
   */
  invalidate(pattern: string): void {
    const keysToDelete: string[] = [];

    for (const [key] of this.cache) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    hitRate: number;
    totalRequests: number;
    hits: number;
    misses: number;
    oldestEntry?: Date;
    newestEntry?: Date;
  } {
    let oldestEntry: Date | undefined;
    let newestEntry: Date | undefined;

    for (const entry of this.cache.values()) {
      if (!oldestEntry || entry.timestamp < oldestEntry) {
        oldestEntry = entry.timestamp;
      }
      if (!newestEntry || entry.timestamp > newestEntry) {
        newestEntry = entry.timestamp;
      }
    }

    return {
      size: this.cache.size,
      hitRate: 0, // This would need to be tracked separately
      totalRequests: 0,
      hits: 0,
      misses: 0,
      oldestEntry,
      newestEntry
    };
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry): boolean {
    return new Date() > entry.expiry;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = new Date();
    for (const [key, entry] of this.cache) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Check if user is authenticated
   */
  private checkAuthentication(): boolean {
    try {
      const token = localStorage.getItem('auth_token');
      return !!token;
    } catch {
      return false;
    }
  }

  /**
   * Check if request has filters that change frequently
   */
  private hasFrequentFilters(context: IMiddlewareContext): boolean {
    if (!context.action || !context.metadata?.params) return false;

    const params = context.metadata.params;
    const frequentFilters = ['q', 'startDate', 'endDate'];

    return frequentFilters.some(filter => params[filter]);
  }
}