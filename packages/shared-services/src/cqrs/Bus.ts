import { ICommand } from './ICommand';
import { IQuery } from './IQuery';
import { ICommandHandler } from './ICommandHandler';
import { IQueryHandler } from './IQueryHandler';

/**
 * Implementation of the Command/Query Bus pattern
 * Centralizes the dispatching of commands and queries to their respective handlers
 */
export class Bus {
  private commandHandlers = new Map<string, ICommandHandler<any>>();
  private queryHandlers = new Map<string, IQueryHandler<any>>();

  /**
   * Register a command handler for a specific command type
   */
  registerCommandHandler<TCommand extends ICommand>(
    commandType: string,
    handler: ICommandHandler<TCommand>
  ): void {
    if (this.commandHandlers.has(commandType)) {
      throw new Error(`Command handler for ${commandType} is already registered`);
    }
    this.commandHandlers.set(commandType, handler);
  }

  /**
   * Register a query handler for a specific query type
   */
  registerQueryHandler<TQuery extends IQuery, TResult>(
    queryType: string,
    handler: IQueryHandler<TQuery, TResult>
  ): void {
    if (this.queryHandlers.has(queryType)) {
      throw new Error(`Query handler for ${queryType} is already registered`);
    }
    this.queryHandlers.set(queryType, handler);
  }

  /**
   * Dispatch a command to its registered handler
   */
  async dispatch<TCommand extends ICommand>(command: TCommand): Promise<any> {
    const commandType = command.constructor.name;
    const handler = this.commandHandlers.get(commandType);

    if (!handler) {
      throw new Error(`No command handler registered for ${commandType}`);
    }

    if (!handler.canHandle(command)) {
      throw new Error(`Handler cannot process command of type ${commandType}`);
    }

    try {
      return await handler.handle(command);
    } catch (error) {
      console.error(`Error executing command ${commandType}:`, error);
      throw error;
    }
  }

  /**
   * Dispatch a query to its registered handler
   */
  async query<TQuery extends IQuery, TResult>(query: TQuery): Promise<TResult> {
    const queryType = query.constructor.name;
    const handler = this.queryHandlers.get(queryType);

    if (!handler) {
      throw new Error(`No query handler registered for ${queryType}`);
    }

    if (!handler.canHandle(query)) {
      throw new Error(`Handler cannot process query of type ${queryType}`);
    }

    try {
      return await handler.handle(query);
    } catch (error) {
      console.error(`Error executing query ${queryType}:`, error);
      throw error;
    }
  }

  /**
   * Check if a command handler is registered
   */
  hasCommandHandler(commandType: string): boolean {
    return this.commandHandlers.has(commandType);
  }

  /**
   * Check if a query handler is registered
   */
  hasQueryHandler(queryType: string): boolean {
    return this.queryHandlers.has(queryType);
  }

  /**
   * Unregister a command handler
   */
  unregisterCommandHandler(commandType: string): void {
    this.commandHandlers.delete(commandType);
  }

  /**
   * Unregister a query handler
   */
  unregisterQueryHandler(queryType: string): void {
    this.queryHandlers.delete(queryType);
  }

  /**
   * Clear all registered handlers (useful for testing)
   */
  clear(): void {
    this.commandHandlers.clear();
    this.queryHandlers.clear();
  }
}

/**
 * Singleton instance of the Bus for application-wide use
 */
export const bus = new Bus();