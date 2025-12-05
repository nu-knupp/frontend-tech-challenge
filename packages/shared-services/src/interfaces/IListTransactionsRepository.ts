import { Transaction, TransactionQuery, PaginatedTransactionResult } from "@banking/shared-types";

export interface IListTransactionsRepository {
  /**
   * Legacy method for backward compatibility
   * @deprecated Use execute method with TransactionQuery instead
   */
  listTransactions(): Promise<Transaction[] | null>;

  /**
   * New method using TransactionQuery for clean architecture
   */
  execute(query: TransactionQuery): Promise<PaginatedTransactionResult>;
}
