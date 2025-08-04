// import { IListTransactionsRepository } from "@/services/interfaces/IListTransactionsRepository";
// import { Transaction } from "@/types/Transaction";

import { Transaction } from "@banking/shared-types";
import { IListTransactionsRepository } from "../interfaces";

export class ListTransactionsUseCase {
  constructor(private repository: IListTransactionsRepository) {}

  async execute(
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
    return this.repository.listTransactions(
      page,
      limit,
      sortBy,
      order,
      type,
      category,
      q,
      startDate,
      endDate,
      includeUncategorized
    );
  }
}
