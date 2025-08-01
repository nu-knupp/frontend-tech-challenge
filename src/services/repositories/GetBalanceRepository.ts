import { IListTransactionsRepository } from "@/services/interfaces/IListTransactionsRepository";
import { Transaction } from "@/types/Transaction";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export class GetBalanceRepository implements IListTransactionsRepository {
  private readonly baseUrl = `${API_BASE_URL}/transactions`;

  async listTransactions(page: number, limit: number, sortBy?: "date" | undefined, order?: "asc" | "desc" | undefined, type?: "credit" | "debit" | undefined): Promise<{ transactions: Transaction[]; total: number; page: number; totalPages: number; }> {
    const response = await axios.get<Transaction[]>(this.baseUrl);
    let transactions = response.data;
    // Filtra por tipo se fornecido
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }
    // Ordena se fornecido
    if (sortBy) {
      transactions = transactions.sort((a, b) => {
        if (order === "desc") {
          return b[sortBy].localeCompare(a[sortBy]);
        }
        return a[sortBy].localeCompare(b[sortBy]);
      });
    }
    const total = transactions.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = transactions.slice((page - 1) * limit, page * limit);
    return {
      transactions: paginated,
      total,
      page,
      totalPages,
    };
  }
}