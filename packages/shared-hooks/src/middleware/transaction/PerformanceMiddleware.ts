import { IMiddleware, IMiddlewareContext, IEnhancedMiddleware, IMiddlewareConfig } from '../IMiddleware';

interface PerformanceMetrics {
  actionCount: Record<string, number>;
  averageExecutionTime: Record<string, number>;
  totalExecutionTime: Record<string, number>;
  lastExecutionTime: Record<string, number>;
  errorCount: Record<string, number>;
  slowActions: Array<{
    action: string;
    duration: number;
    timestamp: Date;
  }>;
}

/**
 * Performance monitoring middleware
 * Tracks execution times and performance metrics
 */
export class PerformanceMiddleware<T extends object, S> implements IEnhancedMiddleware<T, S> {
  public readonly name = 'PerformanceMiddleware';
  public config: IMiddlewareConfig;
  private metrics: PerformanceMetrics = {
    actionCount: {},
    averageExecutionTime: {},
    totalExecutionTime: {},
    lastExecutionTime: {},
    errorCount: {},
    slowActions: []
  };

  constructor(config: Partial<IMiddlewareConfig> & {
    slowActionThreshold?: number;
    maxSlowActions?: number;
  } = {}) {
    this.config = {
      enabled: true,
      priority: 200, // Low priority, executes last
      condition: this.performanceCondition.bind(this),
      ...config
    };

    this.slowActionThreshold = config.slowActionThreshold || 1000; // 1 second default
    this.maxSlowActions = config.maxSlowActions || 50;
  }

  private slowActionThreshold: number;
  private maxSlowActions: number;

  execute(config: T): S {
    // This middleware doesn't modify the config directly
    // Performance tracking is handled in the enhanced methods
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
   * Start timing an action
   */
  startTiming(action: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.recordMetrics(action, duration);
    };
  }

  /**
   * Record an error for an action
   */
  recordError(action: string, error: any): void {
    this.metrics.errorCount[action] = (this.metrics.errorCount[action] || 0) + 1;

    console.warn(`Action "${action}" failed:`, error);
  }

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get action statistics
   */
  getActionStats(action: string): {
    count: number;
    averageTime: number;
    totalTime: number;
    lastTime: number;
    errorCount: number;
    successRate: number;
  } {
    const count = this.metrics.actionCount[action] || 0;
    const averageTime = this.metrics.averageExecutionTime[action] || 0;
    const totalTime = this.metrics.totalExecutionTime[action] || 0;
    const lastTime = this.metrics.lastExecutionTime[action] || 0;
    const errorCount = this.metrics.errorCount[action] || 0;
    const successRate = count > 0 ? ((count - errorCount) / count) * 100 : 100;

    return {
      count,
      averageTime,
      totalTime,
      lastTime,
      errorCount,
      successRate
    };
  }

  /**
   * Get slow actions
   */
  getSlowActions(limit: number = 10): Array<{
    action: string;
    duration: number;
    timestamp: Date;
  }> {
    return this.metrics.slowActions
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = {
      actionCount: {},
      averageExecutionTime: {},
      totalExecutionTime: {},
      lastExecutionTime: {},
      errorCount: {},
      slowActions: []
    };
  }

  /**
   * Generate performance report
   */
  generateReport(): {
    summary: {
      totalActions: number;
      totalTime: number;
      averageTime: number;
      slowestAction: string;
      fastestAction: string;
      errorRate: number;
    };
    actions: Array<{
      action: string;
      stats: ReturnType<PerformanceMiddleware<any, any>['getActionStats']>;
    }>;
    slowActions: Array<{
      action: string;
      duration: number;
      timestamp: Date;
    }>;
  } {
    const actions = Object.keys(this.metrics.actionCount);
    const totalActions = Object.values(this.metrics.actionCount).reduce((sum, count) => sum + count, 0);
    const totalTime = Object.values(this.metrics.totalExecutionTime).reduce((sum, time) => sum + time, 0);
    const averageTime = totalActions > 0 ? totalTime / totalActions : 0;

    const totalErrors = Object.values(this.metrics.errorCount).reduce((sum, count) => sum + count, 0);
    const errorRate = totalActions > 0 ? (totalErrors / totalActions) * 100 : 0;

    let slowestAction = '';
    let fastestAction = '';
    let maxTime = 0;
    let minTime = Infinity;

    actions.forEach(action => {
      const avgTime = this.metrics.averageExecutionTime[action] || 0;
      if (avgTime > maxTime) {
        maxTime = avgTime;
        slowestAction = action;
      }
      if (avgTime < minTime && avgTime > 0) {
        minTime = avgTime;
        fastestAction = action;
      }
    });

    return {
      summary: {
        totalActions,
        totalTime,
        averageTime,
        slowestAction,
        fastestAction,
        errorRate
      },
      actions: actions.map(action => ({
        action,
        stats: this.getActionStats(action)
      })),
      slowActions: this.getSlowActions(20)
    };
  }

  /**
   * Record metrics for an action
   */
  private recordMetrics(action: string, duration: number): void {
    // Update action count
    this.metrics.actionCount[action] = (this.metrics.actionCount[action] || 0) + 1;

    // Update total execution time
    this.metrics.totalExecutionTime[action] = (this.metrics.totalExecutionTime[action] || 0) + duration;

    // Update average execution time
    const count = this.metrics.actionCount[action];
    this.metrics.averageExecutionTime[action] = this.metrics.totalExecutionTime[action] / count;

    // Update last execution time
    this.metrics.lastExecutionTime[action] = duration;

    // Check if action is slow
    if (duration > this.slowActionThreshold) {
      this.metrics.slowActions.push({
        action,
        duration,
        timestamp: new Date()
      });

      // Limit the number of stored slow actions
      if (this.metrics.slowActions.length > this.maxSlowActions) {
        this.metrics.slowActions = this.metrics.slowActions.slice(-this.maxSlowActions);
      }

      console.warn(`Slow action detected: "${action}" took ${duration.toFixed(2)}ms`);
    }

    // Log performance warnings for very slow actions
    if (duration > this.slowActionThreshold * 2) {
      console.error(`Very slow action: "${action}" took ${duration.toFixed(2)}ms`);
    }
  }

  /**
   * Condition for when to track performance
   */
  private performanceCondition(context: IMiddlewareContext): boolean {
    // Don't track in development for certain actions to avoid noise
    if (process.env.NODE_ENV === 'development') {
      const noisyActions = ['fetchTransactions'];
      return !context.action || !noisyActions.includes(context.action);
    }

    return true;
  }
}