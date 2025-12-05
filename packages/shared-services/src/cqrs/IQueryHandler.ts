import { IQuery } from './IQuery';

/**
 * Base interface for Query Handlers in CQRS pattern
 * Each query type should have a corresponding handler
 */
export interface IQueryHandler<TQuery extends IQuery, TResult = any> {
  /**
   * Handle the query and return the result
   * @param query - The query to handle
   * @returns Promise resolving to the query result
   */
  handle(query: TQuery): Promise<TResult>;

  /**
   * Check if this handler can handle the given query
   * @param query - The query to check
   * @returns True if this handler can process the query
   */
  canHandle(query: IQuery): boolean;
}