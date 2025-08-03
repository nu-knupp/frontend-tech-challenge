import { IListTransactionsRepository } from "../interfaces";
import { Transaction } from "@banking/shared-types";
import axios from "axios";

export class ListTransactionsRepository implements IListTransactionsRepository {
  private readonly baseUrl = process.env.JSON_SERVER_URL || "http://localhost:3001/transactions";

  async listTransactions(
    page: number,
    limit: number,
    sortBy: "date" = "date",
    order: "asc" | "desc" = "desc",
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
  }> {
    const response = await axios.get<Transaction[]>(this.baseUrl);
    let data = response.data;

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
