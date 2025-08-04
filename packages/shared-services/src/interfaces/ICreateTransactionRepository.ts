import { Transaction } from "@banking/shared-types";

export interface ICreateTransactionRepository {
  save(transaction: Transaction): Promise<void>;
}
