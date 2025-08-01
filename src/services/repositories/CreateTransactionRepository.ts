import { ICreateTransactionRepository } from "@/services/interfaces/ICreateTransactionRepository";
import { Transaction } from "@/types/Transaction";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export class CreateTransactionRepository implements ICreateTransactionRepository {
  private readonly baseUrl = `${API_BASE_URL}/transactions`;

  async save(transaction: Transaction): Promise<void> {
    return axios.post(this.baseUrl, transaction)
  }
}