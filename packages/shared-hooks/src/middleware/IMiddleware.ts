/**
 * Base interface for Zustand middleware
 */
export interface IMiddleware<T extends object, S> {
  /**
   * Unique identifier for the middleware
   */
  name: string;

  /**
   * Middleware execution function
   * @param config - Store configuration
   * @returns Enhanced store configuration
   */
  execute(config: T): S;
}

/**
 * Middleware context for execution
 */
export interface IMiddlewareContext {
  /**
   * Store name for identification
   */
  storeName: string;

  /**
   * Current action being executed
   */
  action?: string;

  /**
   * Current state before action
   */
  currentState?: any;

  /**
   * Timestamp when middleware is executed
   */
  timestamp: Date;

  /**
   * Additional metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Base middleware configuration
 */
export interface IMiddlewareConfig {
  /**
   * Whether the middleware is enabled
   */
  enabled: boolean;

  /**
   * Priority order (lower numbers execute first)
   */
  priority: number;

  /**
   * Actions to include (empty = all actions)
   */
  includeActions?: string[];

  /**
   * Actions to exclude (empty = none excluded)
   */
  excludeActions?: string[];

  /**
   * Conditional execution function
   */
  condition?: (context: IMiddlewareContext) => boolean;
}

/**
 * Enhanced middleware interface with configuration
 */
export interface IEnhancedMiddleware<T extends object, S> extends IMiddleware<T, S> {
  /**
   * Middleware configuration
   */
  config: IMiddlewareConfig;

  /**
   * Update middleware configuration
   */
  updateConfig: (config: Partial<IMiddlewareConfig>) => void;

  /**
   * Check if middleware should execute for given action
   */
  shouldExecute: (context: IMiddlewareContext) => boolean;
}