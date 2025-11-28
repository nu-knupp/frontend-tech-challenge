import { IListTransactionsRepository } from "../interfaces";
import { Transaction } from "@banking/shared-types";
import axios from "axios";
import { decryptTransactionPayload } from "@banking/shared-utils";

export class ListTransactionsRepository implements IListTransactionsRepository {
  private readonly baseUrl = process.env.JSON_SERVER_URL || "http://localhost:3001/transactions";

  async listTransactions(): Promise<Transaction[] | null>;
  async listTransactions(
    page: number,
    limit: number,
    sortBy?: "date",
    order?: "asc" | "desc",
    type?: "credit" | "debit",
    category?: string[],
    q?: string,
    startDate?: string,
    endDate?: string,
    includeUncategorized?: boolean
  ): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  // Overload without parameters
  async listTransactions(): Promise<Transaction[] | null>;
  // Overload with pagination parameters
  async listTransactions(
    page: number,
    limit: number,
    sortBy?: "date",
    order?: "asc" | "desc",
    type?: "credit" | "debit",
    category?: string[],
    q?: string,
    startDate?: string,
    endDate?: string,
    includeUncategorized?: boolean
  ): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  // Implementation
  async listTransactions(
    page?: number,
    limit?: number,
    sortBy: "date" = "date",
    order: "asc" | "desc" = "desc",
    type?: "credit" | "debit",
    category?: string[],
    q?: string,
    startDate?: string,
    endDate?: string,
    includeUncategorized?: boolean
  ): Promise<Transaction[] | null | {
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await axios.get<Transaction[]>(this.baseUrl);
    let data = response.data.map(decryptTransactionPayload);

    // Se não há parâmetros, retorna todas as transações (para GetBalanceUseCase)
    if (page === undefined && limit === undefined) {
      return data;
    }

    if (type) {
      data = data.filter((t) => t.type === type);
    }

    if (category && category.length > 0) {
      const categories = category.map((c) => c.trim().toLowerCase());

      data = data.filter((t) => {
        const hasCategory = t.categories?.some((cat) =>
          categories.includes(cat.toLowerCase())
        );

        const isUncategorized =
          includeUncategorized &&
          (!t.categories || t.categories.length === 0);

        return hasCategory || isUncategorized;
      });
    } else if (includeUncategorized) {
      data = data.filter((t) => !t.categories || t.categories.length === 0);
    }

    if (q) {
      const query = q.toLowerCase();
      data = data.filter(
        (t) =>
          t.observation?.toLowerCase().includes(query) ||
          t.categories?.some((c) => c.toLowerCase().includes(query))
      );
    }

    if (startDate) {
      const [year, month, day] = startDate.split('-').map(Number);
      const start = new Date(year, month - 1, day, 0, 0, 0).getTime();
      data = data.filter((t) => new Date(t.date).getTime() >= start);
    }

    if (endDate) {
      const [year, month, day] = endDate.split('-').map(Number);
      const end = new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
      data = data.filter((t) => new Date(t.date).getTime() <= end);
    }

    data.sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return order === "asc" ? aTime - bTime : bTime - aTime;
    });

    // At this point, page and limit are guaranteed to be defined
    const currentPage = page!;
    const currentLimit = limit!;
    
    const total = data.length;
    const totalPages = Math.ceil(total / currentLimit);
    const start = (currentPage - 1) * currentLimit;
    const paginated = data.slice(start, start + currentLimit);

    return {
      transactions: paginated,
      total,
      page: currentPage,
      totalPages,
    };
  }
}
