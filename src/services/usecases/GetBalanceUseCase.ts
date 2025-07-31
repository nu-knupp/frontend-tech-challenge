import { IListTransactionsRepository } from "@/services/interfaces/IListTransactionsRepository";

export class GetBalanceUseCase {
  constructor(private repository: IListTransactionsRepository) { }

  async execute(): Promise<number> {
    const result = await this.repository.listTransactions(1, 10);

    return (result.transactions ?? []).reduce((acc: number, transaction: any) => {
      return transaction.type == 'credit' ? acc + transaction.amount : acc - transaction.amount
    }, 0)
  }
}