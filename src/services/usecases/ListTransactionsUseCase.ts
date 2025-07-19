import { IListTransactionsRepository } from "@/services/interfaces/IListTransactionsRepository";
import { Transaction } from "@/types/Transaction";

export class ListTransactionsUseCase {
  constructor(private repository: IListTransactionsRepository) {}

  async execute(
    page: number,
    limit: number,
    sortBy: 'date' = 'date',
    order: 'asc' | 'desc' = 'desc',
    type?: 'credit' | 'debit'
  ): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.repository.listTransactions(page, limit, sortBy, order, type);
  }
}
