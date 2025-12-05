import { IMiddleware, IMiddlewareContext, IEnhancedMiddleware, IMiddlewareConfig } from '../IMiddleware';

/**
 * Logging middleware for debugging and monitoring
 * Logs all store actions and state changes
 */
export class LoggingMiddleware<T extends object, S> implements IEnhancedMiddleware<T, S> {
  public readonly name = 'LoggingMiddleware';
  public config: IMiddlewareConfig;

  constructor(config: Partial<IMiddlewareConfig> = {}) {
    this.config = {
      enabled: true,
      priority: 100, // Low priority, executes early
      includeActions: [], // Log all actions
      excludeActions: [''], // Exclude no actions by default
      ...config
    };
  }

  execute(config: T): S {
    // This middleware doesn't modify the config, just logs the action
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
   * Log method that gets called during execution
   */
  log(context: IMiddlewareContext, newState?: any, prevState?: any): void {
    const logLevel = this.getLogLevel(context.action);

    const logData = {
      store: context.storeName,
      action: context.action,
      timestamp: context.timestamp.toISOString(),
      prevState: prevState ? this.sanitizeState(prevState) : undefined,
      newState: newState ? this.sanitizeState(newState) : undefined,
      metadata: context.metadata
    };

    switch (logLevel) {
      case 'error':
        console.error('🔴 Store Action:', logData);
        break;
      case 'warn':
        console.warn('🟡 Store Action:', logData);
        break;
      case 'info':
        console.info('🟢 Store Action:', logData);
        break;
      default:
        console.log('🔵 Store Action:', logData);
    }
  }

  private getLogLevel(action?: string): 'error' | 'warn' | 'info' | 'log' {
    if (!action) return 'log';

    const errorActions = ['fetchTransactions', 'createTransaction', 'updateTransaction', 'deleteTransaction'];
    const warnActions = ['fetchNextPage'];
    const infoActions = ['fetchBalance'];

    if (errorActions.some(errorAction => action.includes(errorAction))) {
      return 'error';
    }

    if (warnActions.some(warnAction => action.includes(warnAction))) {
      return 'warn';
    }

    if (infoActions.some(infoAction => action.includes(infoAction))) {
      return 'info';
    }

    return 'log';
  }

  private sanitizeState(state: any): any {
    if (!state || typeof state !== 'object') return state;

    // Remove sensitive data and simplify large arrays
    const sanitized = { ...state };

    // Remove large arrays for cleaner logs
    if (sanitized.transactions && Array.isArray(sanitized.transactions)) {
      sanitized.transactions = `[${sanitized.transactions.length} items]`;
    }

    // Remove potentially sensitive data
    delete sanitized.rawApiResponse;

    return sanitized;
  }
}