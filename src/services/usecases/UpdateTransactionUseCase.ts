import { IUpdateTransactionRepository } from "@/services/interfaces/IUpdateTransactionRepository";
import { Transaction } from "@/types/Transaction";

export class UpdateTransactionUseCase {
  constructor(private repository: IUpdateTransactionRepository) {}
  async execute(id: string, data: Partial<Transaction>): Promise<void> {
    return this.repository.update(id, data)
  }
}