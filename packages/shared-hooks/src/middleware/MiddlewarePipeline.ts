import { IMiddleware, IMiddlewareContext, IEnhancedMiddleware } from './IMiddleware';

/**
 * Pipeline for executing Zustand middleware in order
 * Provides a clean way to chain and manage middleware execution
 */
export class MiddlewarePipeline<T extends object, S> {
  private middlewares: IEnhancedMiddleware<T, S>[] = [];
  private context: IMiddlewareContext;

  constructor(storeName: string, metadata?: Record<string, any>) {
    this.context = {
      storeName,
      timestamp: new Date(),
      metadata
    };
  }

  /**
   * Add middleware to the pipeline
   * Middlewares are sorted by priority (lower numbers execute first)
   */
  add(middleware: IEnhancedMiddleware<T, S>): void {
    this.middlewares.push(middleware);
    this.sortByPriority();
  }

  /**
   * Remove middleware from the pipeline
   */
  remove(middlewareName: string): void {
    this.middlewares = this.middlewares.filter(m => m.name !== middlewareName);
  }

  /**
   * Get middleware by name
   */
  get(middlewareName: string): IEnhancedMiddleware<T, S> | undefined {
    return this.middlewares.find(m => m.name === middlewareName);
  }

  /**
   * Check if middleware exists in pipeline
   */
  has(middlewareName: string): boolean {
    return this.middlewares.some(m => m.name === middlewareName);
  }

  /**
   * Execute all enabled middlewares in order
   */
  execute(config: T, action?: string, currentState?: any): S {
    const executionContext: IMiddlewareContext = {
      ...this.context,
      action,
      currentState,
      timestamp: new Date()
    };

    let result: any = config;

    for (const middleware of this.middlewares) {
      if (middleware.shouldExecute(executionContext)) {
        try {
          result = middleware.execute(result);
        } catch (error) {
          console.error(`Error in middleware "${middleware.name}":`, error);
          // Continue execution even if a middleware fails
        }
      }
    }

    return result as S;
  }

  /**
   * Get all middlewares
   */
  getAll(): ReadonlyArray<IEnhancedMiddleware<T, S>> {
    return [...this.middlewares];
  }

  /**
   * Clear all middlewares
   */
  clear(): void {
    this.middlewares = [];
  }

  /**
   * Enable/disable middleware by name
   */
  setEnabled(middlewareName: string, enabled: boolean): void {
    const middleware = this.get(middlewareName);
    if (middleware) {
      middleware.updateConfig({ enabled });
    }
  }

  /**
   * Get middleware execution statistics
   */
  getStats(): {
    total: number;
    enabled: number;
    disabled: number;
    byPriority: Array<{ priority: number; count: number; names: string[] }>;
  } {
    const enabled = this.middlewares.filter(m => m.config.enabled).length;
    const disabled = this.middlewares.length - enabled;

    const byPriority = this.middlewares.reduce((acc, middleware) => {
      const priority = middleware.config.priority;
      const existing = acc.find(p => p.priority === priority);

      if (existing) {
        existing.count++;
        existing.names.push(middleware.name);
      } else {
        acc.push({
          priority,
          count: 1,
          names: [middleware.name]
        });
      }

      return acc;
    }, [] as Array<{ priority: number; count: number; names: string[] }>);

    return {
      total: this.middlewares.length,
      enabled,
      disabled,
      byPriority: byPriority.sort((a, b) => a.priority - b.priority)
    };
  }

  /**
   * Sort middlewares by priority
   */
  private sortByPriority(): void {
    this.middlewares.sort((a, b) => a.config.priority - b.config.priority);
  }

  /**
   * Update context metadata
   */
  updateMetadata(metadata: Record<string, any>): void {
    this.context.metadata = { ...this.context.metadata, ...metadata };
  }
}