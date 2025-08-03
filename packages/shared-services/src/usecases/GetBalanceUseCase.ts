import { IListTransactionsRepository } from "../interfaces";

export class GetBalanceUseCase {
  constructor(private repository: IListTransactionsRepository) {}

  async execute(): Promise<number> {
    const result = await this.repository.listTransactions(1, 1000);
    const transactions = result.transactions;

    return transactions.reduce((balance, transaction) => {
      return transaction.type === "credit"
        ? balance + transaction.amount
        : balance - transaction.amount;
    }, 0);
  }
}
