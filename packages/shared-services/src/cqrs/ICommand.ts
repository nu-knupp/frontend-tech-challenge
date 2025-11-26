/**
 * Base interface for all Commands in CQRS pattern
 * Commands represent operations that change system state
 */
export interface ICommand<T = any> {
  /**
   * Unique identifier for the command
   */
  id: string;

  /**
   * Timestamp when the command was created
   */
  timestamp: Date;

  /**
   * Optional metadata about the command
   */
  metadata?: Record<string, any>;

  /**
   * Command payload data
   */
  data: T;
}