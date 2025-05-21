import { ICreateTransactionRepository } from "@/services/interfaces/ICreateTransactionRepository";
import { Transaction } from "@/types/Transaction";
import axios from "axios";

export class CreateTransactionRepository implements ICreateTransactionRepository {
  private readonly baseUrl = "http://localhost:3001/transactions";

  async save(transaction: Transaction): Promise<void> {
    return axios.post(this.baseUrl, transaction)
  }
}