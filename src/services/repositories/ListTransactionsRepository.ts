import { IListTransactionsRepository } from "@/services/interfaces/IListTransactionsRepository";
import { Transaction } from "@/types/Transaction";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export class ListTransactionsRepository implements IListTransactionsRepository {
  private readonly baseUrl = `${API_BASE_URL}/transactions`;

  async listTransactions(
    page: number,
    limit: number,
    sortBy: "date" = "date",
    order: "asc" | "desc" = "desc",
    type?: "credit" | "debit"
  ): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await axios.get<Transaction[]>(this.baseUrl);

    let data = response.data;

    if (type) {
      data = data.filter((t) => t.type === type);
    }

    data.sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return order === "asc" ? aTime - bTime : bTime - aTime;
    });

    const total = data.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = data.slice(start, start + limit);

    return {
      transactions: paginated,
      total,
      page,
      totalPages,
    };
  }
}
