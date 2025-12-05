import { IMiddleware, IMiddlewareContext, IEnhancedMiddleware, IMiddlewareConfig } from '../IMiddleware';

/**
 * Persistence middleware for storing state in localStorage
 * Provides offline capability and state restoration
 */
export class PersistenceMiddleware<T extends object, S> implements IEnhancedMiddleware<T, S> {
  public readonly name = 'PersistenceMiddleware';
  public config: IMiddlewareConfig;
  private storageKey: string;

  constructor(
    storeName: string,
    config: Partial<IMiddlewareConfig> & {
      storageKey?: string;
      persistKeys?: string[];
    } = {}
  ) {
    this.storageKey = config.storageKey || `${storeName}_state`;
    this.config = {
      enabled: true,
      priority: 50, // Medium priority
      includeActions: [], // All actions trigger persistence
      excludeActions: ['fetchTransactions', 'fetchBalance'], // Don't persist loading states
      ...config
    };
  }

  execute(config: T): S {
    // This middleware doesn't modify the config directly
    // Persistence is handled through the enhanced methods
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

    // Check include actions
    if (this.config.includeActions && this.config.includeActions.length > 0) {
      if (!context.action || !this.config.includeActions.includes(context.action)) {
        return false;
      }
    }

    // Check exclude actions
    if (this.config.excludeActions && this.config.excludeActions.length > 0) {
      if (context.action && this.config.excludeActions.includes(context.action)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Save state to localStorage
   */
  save(state: any): void {
    try {
      const stateToSave = this.selectivePersist(state);
      const serializedState = JSON.stringify(stateToSave);

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.storageKey, serializedState);
      }
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  }

  /**
   * Load state from localStorage
   */
  load(): any | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }

      const serializedState = window.localStorage.getItem(this.storageKey);
      if (!serializedState) return null;

      return JSON.parse(serializedState);
    } catch (error) {
      console.warn('Failed to load state from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear persisted state
   */
  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(this.storageKey);
      }
    } catch (error) {
      console.warn('Failed to clear persisted state:', error);
    }
  }

  /**
   * Selectively persist parts of the state
   */
  private selectivePersist(state: any): any {
    // Don't persist loading states or temporary data
    const { loading, ...persistedState } = state;

    // Only persist essential data
    return {
      transactions: persistedState.transactions || [],
      balance: persistedState.balance || "0",
      page: persistedState.page || 1,
      totalPages: persistedState.totalPages || 1,
      // Don't persist timestamps or metadata
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Validate persisted state before loading
   */
  validateState(state: any): boolean {
    if (!state || typeof state !== 'object') return false;

    // Check for required properties
    const requiredProps = ['transactions', 'balance'];
    return requiredProps.every(prop => state.hasOwnProperty(prop));
  }

  /**
   * Merge persisted state with initial state
   */
  mergeWithInitialState(persistedState: any, initialState: T): T {
    return {
      ...initialState,
      ...persistedState,
      // Always reset loading state
      loading: false
    };
  }

  /**
   * Check if persistence is available
   */
  isAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__persistence_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage quota information
   */
  getStorageInfo(): {
    used: number;
    available: number;
    quota: number;
    usagePercentage: number;
  } | null {
    if (!this.isAvailable()) return null;

    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      const used = new Blob([window.localStorage.getItem(this.storageKey) || '']).size;
      const quota = 5 * 1024 * 1024; // 5MB typical localStorage quota
      const available = quota - used;
      const usagePercentage = (used / quota) * 100;

      return { used, available, quota, usagePercentage };
    } catch {
      return null;
    }
  }
}