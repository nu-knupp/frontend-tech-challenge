import { IUpdateTransactionRepository } from "@/services/interfaces/IUpdateTransactionRepository";
import { Transaction } from "@/types/Transaction";
import axios from "axios";

export class UpdateTransactionRepository implements IUpdateTransactionRepository {
  private readonly baseUrl = 'http://localhost:3001/transactions'

  async update(id: string, data: Partial<Transaction>): Promise<void> {
    axios.patch(this.baseUrl + `/${id}`, data)
  }
}