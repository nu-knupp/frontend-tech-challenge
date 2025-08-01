import { IUpdateTransactionRepository } from "../interfaces/IUpdateTransactionRepository";
import { Transaction } from "@/types/Transaction";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export class UpdateTransactionRepository implements IUpdateTransactionRepository {
  private readonly baseUrl = `${API_BASE_URL}/transactions`;

  async update(id: string, data: Partial<Transaction>): Promise<void> {
    axios.patch(this.baseUrl + `/${id}`, data)
  }
}