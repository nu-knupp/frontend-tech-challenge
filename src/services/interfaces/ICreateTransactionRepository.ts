import { Transaction } from "@/types/Transaction";

export interface ICreateTransactionRepository {
  save(transaction: Transaction): Promise<void>;
}
