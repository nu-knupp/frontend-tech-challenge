import { IListTransactionsRepository } from "@/services/interfaces/IListTransactionsRepository";
import { Transaction } from "@/types/Transaction";
import { API_CONFIG } from "@/config/api";
import axios from "axios";

export class GetBalanceRepository implements IListTransactionsRepository {
  private readonly baseUrl = API_CONFIG.transactionsUrl;

  async listTransactions(
    page: number = 1,
    limit: number = 1000,
    sortBy: "date" = "date",
    order: "asc" | "desc" = "desc",
    type?: "credit" | "debit"
  ): Promise<{ transactions: Transaction[]; total: number; page: number; totalPages: number }> {
    const params: any = { page, limit, sort: order };
    if (type) params.type = type;
    const response = await axios.get(this.baseUrl, { params });
    // Suporte para API que retorna array simples (mock) ou objeto paginado
    if (Array.isArray(response.data)) {
      return {
        transactions: response.data,
        total: response.data.length,
        page,
        totalPages: 1,
      };
    }
    return response.data;
  }
}