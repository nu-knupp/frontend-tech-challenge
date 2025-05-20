import { Transaction } from "@/types/Transaction";

export interface IListTransactionsRepository {
  listTransactions(): Promise<Transaction[] | null>;
}
