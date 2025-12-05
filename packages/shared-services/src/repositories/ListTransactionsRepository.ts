import { IListTransactionsRepository } from "../interfaces";
import { Transaction, TransactionQuery, PaginatedTransactionResult } from "@banking/shared-types";
import axios from "axios";
import { decryptTransactionPayload } from "@banking/shared-utils";

export class ListTransactionsRepository implements IListTransactionsRepository {
  private readonly baseUrl = process.env.JSON_SERVER_URL || "http://localhost:3001/transactions";

  /**
   * Legacy method for backward compatibility
   * @deprecated Use execute method with TransactionQuery instead
   */
  async listTransactions(): Promise<Transaction[] | null> {
    const response = await axios.get<Transaction[]>(this.baseUrl);
    return response.data;
  }

  /**
   * New method using TransactionQuery for clean architecture
   */
  async execute(query: TransactionQuery): Promise<PaginatedTransactionResult> {
    const response = await axios.get<Transaction[]>(this.baseUrl);
    let data = response.data.map(decryptTransactionPayload);

    // Apply filters
    if (query.filters) {
      // Filter by type
      if (query.filters.type) {
        data = data.filter((t) => t.type === query.filters!.type);
      }

      // Filter by categories
      if (query.filters.categories && query.filters.categories.length > 0) {
        const categories = query.filters.categories.map((c) => c.trim().toLowerCase());
        data = data.filter((t) =>
          t.categories?.some((cat) => categories.includes(cat.toLowerCase()))
        );
      }

      // Filter by date range
      if (query.filters.startDate) {
        const [year, month, day] = query.filters.startDate.split('-').map(Number);
        const start = new Date(year, month - 1, day, 0, 0, 0).getTime();
        data = data.filter((t) => new Date(t.date).getTime() >= start);
      }

      if (query.filters.endDate) {
        const [year, month, day] = query.filters.endDate.split('-').map(Number);
        const end = new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
        data = data.filter((t) => new Date(t.date).getTime() <= end);
      }
    }

    // Apply search
    if (query.search && query.search.query) {
      const searchQuery = query.search.query.toLowerCase();
      data = data.filter((t) => {
        if (!query.search!.fields || query.search!.fields.length === 0) {
          // Search in all relevant fields if no specific fields specified
          return t.observation?.toLowerCase().includes(searchQuery) ||
                 t.categories?.some((c) => c.toLowerCase().includes(searchQuery));
        }

        return query.search!.fields.some((field) => {
          switch (field) {
            case 'description':
              return t.observation?.toLowerCase().includes(searchQuery);
            case 'category':
              return t.categories?.some((c) => c.toLowerCase().includes(searchQuery));
            default:
              return false;
          }
        });
      });
    }

    // Apply sorting
    if (query.sort) {
      const sortBy = query.sort.sortBy || 'date';
      const order = query.sort.order || 'desc';

      data.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortBy) {
          case 'date':
            aValue = new Date(a.date).getTime();
            bValue = new Date(b.date).getTime();
            break;
          case 'amount':
            aValue = parseFloat(a.amount);
            bValue = parseFloat(b.amount);
            break;
          case 'description':
            aValue = a.observation || '';
            bValue = b.observation || '';
            break;
          default:
            aValue = a[sortBy as keyof Transaction];
            bValue = b[sortBy as keyof Transaction];
        }

        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    const page = query.pagination.page;
    const limit = query.pagination.limit;
    const total = data.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = data.slice(start, start + limit);

    return {
      transactions: paginated,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}
