import { IDeleteTransactionRepository } from "@/services/interfaces/IDeleteTransactionRepository";

export class DeleteTransactionUseCase {
  constructor(private repository: IDeleteTransactionRepository) {}
  async execute(id: string): Promise<void> {
    await this.repository.delete(id)
  }
}