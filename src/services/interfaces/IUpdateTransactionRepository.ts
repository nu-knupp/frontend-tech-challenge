import { Transaction } from "@/types/Transaction";

export interface IUpdateTransactionRepository {
  update(id: string, data: Partial<Transaction>): Promise<void>;
}