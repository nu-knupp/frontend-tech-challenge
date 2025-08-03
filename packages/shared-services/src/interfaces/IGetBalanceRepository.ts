import { Transaction } from "@banking/shared-types";

export interface IGetBalanceRepository {
  listTransactions(): Promise<Transaction[] | null>;
}
