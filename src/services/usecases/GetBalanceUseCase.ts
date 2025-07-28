import { IListTransactionsRepository } from "@/services/interfaces/IListTransactionsRepository";
import { Transaction } from "@/types/Transaction";

export class GetBalanceUseCase {
  constructor(private repository: IListTransactionsRepository) { }

  async execute(): Promise<number> {
    const { transactions } = await this.repository.listTransactions(1, 1000);
    return transactions.reduce((acc: number, transaction: Transaction) => {
      return transaction.type === 'credit' ? acc + transaction.amount : acc - transaction.amount;
    }, 0);
  }
}