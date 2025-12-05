/**
 * Result pattern for handling operations that can fail
 * Provides a type-safe way to handle success and error cases without exceptions
 */

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export class ResultFactory {
  /**
   * Create a successful result
   */
  static success<T>(data: T): Result<T> {
    return {
      success: true,
      data
    };
  }

  /**
   * Create a failure result
   */
  static failure<T, E = Error>(error: E): Result<T, E> {
    return {
      success: false,
      error
    };
  }

  /**
   * Check if a result is successful
   */
  static isSuccess<T, E>(result: Result<T, E>): result is { success: true; data: T } {
    return result.success;
  }

  /**
   * Check if a result is a failure
   */
  static isFailure<T, E>(result: Result<T, E>): result is { success: false; error: E } {
    return !result.success;
  }

  /**
   * Execute a function and wrap result in Result type
   */
  static try<T>(fn: () => T): Result<T> {
    try {
      return ResultFactory.success(fn());
    } catch (error) {
      return ResultFactory.failure(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Execute an async function and wrap result in Result type
   */
  static async tryAsync<T>(fn: () => Promise<T>): Promise<Result<T>> {
    try {
      const data = await fn();
      return ResultFactory.success(data);
    } catch (error) {
      return ResultFactory.failure(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Get data from result or throw if error
   */
  static getData<T>(result: Result<T>): T {
    if (result.success) {
      return result.data;
    }
    throw result.error;
  }

  /**
   * Get error from result or null if success
   */
  static getError<T, E>(result: Result<T, E>): E | null {
    return result.success ? null : result.error;
  }
}

// Export helper functions for convenience
export const success = ResultFactory.success;
export const failure = ResultFactory.failure;
export const isSuccess = ResultFactory.isSuccess;
export const isFailure = ResultFactory.isFailure;
export const tryCatch = ResultFactory.try;
export const tryAsync = ResultFactory.tryAsync;