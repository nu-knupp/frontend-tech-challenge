import { IListTransactionsRepository } from "@/services/interfaces/IListTransactionsRepository";
import { Transaction } from "@/types/Transaction";
import axios from "axios";

export class ListTransactionsRepository implements IListTransactionsRepository {
  private readonly baseUrl = "http://localhost:3001/transactions";

  async listTransactions(): Promise<Transaction[] | null> {
    const response = await axios.get<Transaction[]>(this.baseUrl)

  const sorted = response.data.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

    return sorted
  }
}