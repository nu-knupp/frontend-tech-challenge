import { IListTransactionsRepository } from "@/services/interfaces/IListTransactionsRepository";
import { Transaction } from "@/types/Transaction";
import axios from "axios";

export class GetBalanceRepository implements IListTransactionsRepository {
  private readonly baseUrl = "http://localhost:3001/transactions";

  async listTransactions(): Promise<Transaction[] | null> {
    const response = await axios.get<Transaction[]>(this.baseUrl)

    return response.data
  }
}