import { IDeleteTransactionRepository } from "../interfaces";

export class DeleteTransactionUseCase {
  constructor(private repository: IDeleteTransactionRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
