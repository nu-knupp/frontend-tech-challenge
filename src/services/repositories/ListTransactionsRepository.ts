import { IListTransactionsRepository } from "@/services/interfaces/IListTransactionsRepository";
import { Transaction } from "@/types/Transaction";
import { API_CONFIG } from "@/config/api";
import axios from "axios";

export class ListTransactionsRepository implements IListTransactionsRepository {
  private readonly baseUrl = API_CONFIG.transactionsUrl;

  async listTransactions(): Promise<Transaction[] | null> {
    const response = await axios.get<Transaction[]>(this.baseUrl)

  const sorted = response.data.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

    return sorted
  }
}