import { Transaction } from "@/types/Transaction";

export interface IListTransactionsRepository {
  listTransactions(
    page: number,
    limit: number,
    sortBy?: "date",
    order?: "asc" | "desc",
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
  }>;
}
