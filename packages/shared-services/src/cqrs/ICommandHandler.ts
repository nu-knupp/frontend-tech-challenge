import { ICommand } from './ICommand';

/**
 * Base interface for Command Handlers in CQRS pattern
 * Each command type should have a corresponding handler
 */
export interface ICommandHandler<TCommand extends ICommand> {
  /**
   * Handle the command and return the result
   * @param command - The command to handle
   * @returns Promise resolving to the command result
   */
  handle(command: TCommand): Promise<any>;

  /**
   * Check if this handler can handle the given command
   * @param command - The command to check
   * @returns True if this handler can process the command
   */
  canHandle(command: ICommand): boolean;
}