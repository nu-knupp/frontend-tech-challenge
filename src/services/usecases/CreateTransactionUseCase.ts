import { ICreateTransactionRepository } from "@/services/interfaces/ICreateTransactionRepository";
import { Transaction } from "@/types/Transaction";
import { v4 as uuidv4 } from "uuid";

export class CreateTransactionUseCase{
  constructor(private repository: ICreateTransactionRepository) { }

  async execute(data: Omit<Transaction, 'id'>): Promise<void> {
    const transaction: Transaction = {
      ...data,
      id: uuidv4(),
    };

    return this.repository.save(transaction)
  }
}