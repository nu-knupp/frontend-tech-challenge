import { Transaction } from "@banking/shared-types";

export interface IListTransactionsRepository {
  listTransactions(
    page: number,
    limit: number,
    sortBy?: "date",
    order?: "asc" | "desc",
    type?: "credit" | "debit"
  ): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}

export interface ICreateTransactionRepository {
  save(transaction: Transaction): Promise<void>;
}

export interface IUpdateTransactionRepository {
  update(id: string, transaction: Partial<Transaction>): Promise<void>;
}

export interface IDeleteTransactionRepository {
  delete(id: string): Promise<void>;
}
