import { IGetBalanceRepository } from "../interfaces/IGetBalanceRepository";

export class GetBalanceUseCase {
  constructor(private repository: IGetBalanceRepository) {}

  async execute(): Promise<number> {
    const transactions = await this.repository.listTransactions();

    return (transactions ?? []).reduce((balance, transaction) => {
      return transaction.type === "credit"
        ? balance + transaction.amount
        : balance - transaction.amount;
    }, 0);
  }
}
