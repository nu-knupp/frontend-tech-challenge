import { IListTransactionsRepository } from "@/services/interfaces/IListTransactionsRepository";
import { Transaction } from "@/types/Transaction";

export class ListTransactionsUseCase {
  constructor(private repository: IListTransactionsRepository) { }

  async execute(): Promise<Transaction[] | null> {
    return this.repository.listTransactions()
  }
}