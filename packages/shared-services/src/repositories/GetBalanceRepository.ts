import { IListTransactionsRepository } from "../interfaces";
import { Transaction } from "@banking/shared-types";

export class GetBalanceRepository implements IListTransactionsRepository {
  private readonly baseUrl = process.env.JSON_SERVER_URL || "http://localhost:3001/transactions";

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
    // Implementação para buscar transações e calcular saldo
    // Esta implementação pode ser melhorada posteriormente
    const response = await fetch(this.baseUrl);
    const data: Transaction[] = await response.json();

    let filteredData = data;
    if (type) {
      filteredData = data.filter((t) => t.type === type);
    }

    filteredData.sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return order === "asc" ? aTime - bTime : bTime - aTime;
    });

    const total = filteredData.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = filteredData.slice(start, start + limit);

    return {
      transactions: paginated,
      total,
      page,
      totalPages,
    };
  }
}
