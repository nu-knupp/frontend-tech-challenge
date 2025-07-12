import { IListTransactionsRepository } from "@/services/interfaces/IListTransactionsRepository";
import { Transaction } from "@/types/Transaction";
import { API_CONFIG } from "@/config/api";
import axios from "axios";

export class GetBalanceRepository implements IListTransactionsRepository {
  private readonly baseUrl = API_CONFIG.transactionsUrl;

  async listTransactions(): Promise<Transaction[] | null> {
    const response = await axios.get<Transaction[]>(this.baseUrl)

    return response.data
  }
}