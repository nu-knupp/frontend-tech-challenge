import {
  Transaction,
  TransactionQuery,
  PaginatedTransactionResult,
  PaginationOptions
} from "@banking/shared-types";
import { IListTransactionsRepository } from "../interfaces";

/**
 * Use Case for listing transactions with clean architecture patterns
 * Uses TransactionQuery object instead of multiple parameters
 */
export class ListTransactionsUseCase {
  constructor(private repository: IListTransactionsRepository) {}

  /**
   * Execute the transaction listing query
   * @param query - TransactionQuery object with all filtering, sorting and pagination options
   * @returns PaginatedTransactionResult with transactions and pagination metadata
   */
  async execute(query: TransactionQuery): Promise<PaginatedTransactionResult> {
    // Business logic validation
    this.validateQuery(query);

    // Execute the query through the repository
    return this.repository.execute(query);
  }

  /**
   * Execute with pagination only (convenience method)
   */
  async executeWithPagination(
    page: number,
    limit: number
  ): Promise<PaginatedTransactionResult> {
    const query: TransactionQuery = {
      pagination: { page, limit },
      sort: { sortBy: 'date', order: 'desc' }
    };

    return this.execute(query);
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use execute method with TransactionQuery instead
   */
  async executeLegacy(
    page: number,
    limit: number,
    sortBy: "date" = "date",
    order: "asc" | "desc" = "desc",
    type?: "credit" | "debit",
    category?: string[],
    q?: string,
    startDate?: string,
    endDate?: string,
    includeUncategorized?: boolean
  ): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    // Convert legacy parameters to new query format
    const query: TransactionQuery = {
      pagination: { page, limit },
      sort: { sortBy, order },
      filters: {
        type,
        category,
        includeUncategorized
      },
      search: {
        query: q,
        startDate,
        endDate
      }
    };

    const result = await this.execute(query);

    // Convert back to legacy format
    return {
      transactions: result.transactions,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    };
  }

  /**
   * Validate the query according to business rules
   */
  private validateQuery(query: TransactionQuery): void {
    if (!query.pagination) {
      throw new Error("Pagination options are required");
    }

    if (query.pagination.page < 1) {
      throw new Error("Page number must be greater than 0");
    }

    if (query.pagination.limit < 1 || query.pagination.limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }

    if (query.search?.startDate && query.search?.endDate) {
      const start = new Date(query.search.startDate);
      const end = new Date(query.search.endDate);

      if (start > end) {
        throw new Error("Start date cannot be after end date");
      }
    }
  }
}
