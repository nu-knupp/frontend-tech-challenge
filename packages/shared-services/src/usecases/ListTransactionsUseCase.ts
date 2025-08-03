import { IListTransactionsRepository } from "../interfaces";

export class ListTransactionsUseCase {
  constructor(private repository: IListTransactionsRepository) {}

  async execute(
    page: number,
    limit: number,
    sortBy: "date" = "date",
    order: "asc" | "desc" = "desc",
    type?: "credit" | "debit"
  ) {
    return await this.repository.listTransactions(page, limit, sortBy, order, type);
  }
}
