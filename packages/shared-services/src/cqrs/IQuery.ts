/**
 * Base interface for all Queries in CQRS pattern
 * Queries represent operations that read system state
 */
export interface IQuery<T = any, TResult = any> {
  /**
   * Unique identifier for the query
   */
  id: string;

  /**
   * Timestamp when the query was created
   */
  timestamp: Date;

  /**
   * Optional metadata about the query
   */
  metadata?: Record<string, any>;

  /**
   * Query parameters
   */
  parameters: T;
}