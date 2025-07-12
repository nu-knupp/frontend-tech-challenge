import { ICreateTransactionRepository } from "@/services/interfaces/ICreateTransactionRepository";
import { Transaction } from "@/types/Transaction";
import { API_CONFIG } from "@/config/api";
import axios from "axios";

export class CreateTransactionRepository implements ICreateTransactionRepository {
  private readonly baseUrl = API_CONFIG.transactionsUrl;

  async save(transaction: Transaction): Promise<void> {
    return axios.post(this.baseUrl, transaction)
  }
}