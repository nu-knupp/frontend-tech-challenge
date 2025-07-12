import { IUpdateTransactionRepository } from "@/services/interfaces/IUpdateTransactionRepository";
import { Transaction } from "@/types/Transaction";
import { API_CONFIG } from "@/config/api";
import axios from "axios";

export class UpdateTransactionRepository implements IUpdateTransactionRepository {
  private readonly baseUrl = API_CONFIG.transactionsUrl;

  async update(id: string, data: Partial<Transaction>): Promise<void> {
    axios.patch(this.baseUrl + `/${id}`, data)
  }
}