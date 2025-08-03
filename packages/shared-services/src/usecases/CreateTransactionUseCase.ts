import { ICreateTransactionRepository } from "../interfaces";
import { Transaction } from "@banking/shared-types";
import { v4 as uuidv4 } from "uuid";

export class CreateTransactionUseCase {
  constructor(private repository: ICreateTransactionRepository) {}

  async execute(data: Omit<Transaction, 'id'>): Promise<void> {
    const transaction: Transaction = {
      ...data,
      id: uuidv4(),
    };

    await this.repository.save(transaction);
  }
}
