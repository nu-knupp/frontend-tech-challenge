import { Transaction } from "@banking/shared-types";

export interface IUpdateTransactionRepository {
  update(id: string, data: Partial<Transaction>): Promise<void>;
}
