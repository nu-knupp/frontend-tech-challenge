import { IListTransactionsRepository } from "@/services/interfaces/IListTransactionsRepository";

export class GetBalanceUseCase {
  constructor(private repository: IListTransactionsRepository) { }

  async execute(): Promise<number> {
    const transactions = await this.repository.listTransactions()

    return (transactions ?? []).reduce((acc, transaction) => {
      return transaction.type == 'credit' ? acc + transaction.amount : acc - transaction.amount
    }, 0)
  }
}