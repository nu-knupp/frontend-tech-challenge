import { IUpdateTransactionRepository } from "../interfaces";
import { Transaction } from "@banking/shared-types";

export class UpdateTransactionUseCase {
  constructor(private repository: IUpdateTransactionRepository) {}

  async execute(id: string, data: Partial<Transaction>): Promise<void> {
    return this.repository.update(id, data);
  }
}
