import { IQueryHandler } from '../IQueryHandler';
import {
  ListTransactionsQuery,
  GetTransactionByIdQuery,
  GetTransactionStatsQuery,
  GetBalanceTrendsQuery,
  SearchTransactionsQuery
} from '../queries/TransactionQueries';
import { Transaction, PaginatedTransactionResult } from "@banking/shared-types";

/**
 * Handler for listing transactions with pagination and filtering
 */
export class ListTransactionsQueryHandler implements IQueryHandler<ListTransactionsQuery, PaginatedTransactionResult> {
  constructor(
    private listTransactionsRepository: {
      execute: (query: any) => Promise<PaginatedTransactionResult>;
    }
  ) {}

  canHandle(query: ListTransactionsQuery): boolean {
    return query instanceof ListTransactionsQuery;
  }

  async handle(query: ListTransactionsQuery): Promise<PaginatedTransactionResult> {
    try {
      return await this.listTransactionsRepository.execute(query.parameters);
    } catch (error) {
      console.error('Failed to list transactions:', error);
      throw new Error(`Failed to list transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Handler for getting a specific transaction by ID
 */
export class GetTransactionByIdQueryHandler implements IQueryHandler<GetTransactionByIdQuery, Transaction | null> {
  constructor(
    private getTransactionRepository: {
      getTransactionById: (id: string) => Promise<Transaction | null>;
    }
  ) {}

  canHandle(query: GetTransactionByIdQuery): boolean {
    return query instanceof GetTransactionByIdQuery;
  }

  async handle(query: GetTransactionByIdQuery): Promise<Transaction | null> {
    const { id } = query.parameters;

    if (!id) {
      throw new Error('Transaction ID is required');
    }

    try {
      const transaction = await this.getTransactionRepository.getTransactionById(id);

      if (!transaction) {
        console.log(`Transaction with id ${id} not found`);
        return null;
      }

      return transaction;
    } catch (error) {
      console.error('Failed to get transaction by ID:', error);
      throw new Error(`Failed to get transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Handler for getting transaction statistics
 */
export class GetTransactionStatsQueryHandler implements IQueryHandler<GetTransactionStatsQuery, {
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  creditCount: number;
  debitCount: number;
  creditTotal: number;
  debitTotal: number;
}> {
  constructor(
    private listTransactionsRepository: {
      execute: (query: any) => Promise<PaginatedTransactionResult>;
    }
  ) {}

  canHandle(query: GetTransactionStatsQuery): boolean {
    return query instanceof GetTransactionStatsQuery;
  }

  async handle(query: GetTransactionStatsQuery): Promise<{
    totalTransactions: number;
    totalAmount: number;
    averageAmount: number;
    creditCount: number;
    debitCount: number;
    creditTotal: number;
    debitTotal: number;
  }> {
    const { userEmail, startDate, endDate } = query.parameters;

    try {
      // Get all transactions for the given criteria
      const allTransactionsQuery = {
        pagination: { page: 1, limit: 10000 }, // Large limit to get all transactions
        filters: { type: undefined },
        search: { startDate, endDate, query: undefined }
      };

      const result = await this.listTransactionsRepository.execute(allTransactionsQuery);

      // Filter by user email if specified
      const transactions = userEmail
        ? result.transactions.filter(t => t.userEmail === userEmail)
        : result.transactions;

      // Calculate statistics
      const stats = this.calculateStatistics(transactions);

      return stats;
    } catch (error) {
      console.error('Failed to get transaction statistics:', error);
      throw new Error(`Failed to get statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateStatistics(transactions: Transaction[]) {
    const creditTransactions = transactions.filter(t => t.type === 'credit');
    const debitTransactions = transactions.filter(t => t.type === 'debit');

    const creditTotal = creditTransactions.reduce((sum, t) => sum + t.amount, 0);
    const debitTotal = debitTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalAmount = creditTotal - debitTotal;

    return {
      totalTransactions: transactions.length,
      totalAmount,
      averageAmount: transactions.length > 0 ? Math.abs(totalAmount) / transactions.length : 0,
      creditCount: creditTransactions.length,
      debitCount: debitTransactions.length,
      creditTotal,
      debitTotal
    };
  }
}

/**
 * Handler for getting monthly balance trends
 */
export class GetBalanceTrendsQueryHandler implements IQueryHandler<GetBalanceTrendsQuery, {
  month: string;
  income: number;
  expense: number;
  balance: number;
}[]> {
  constructor(
    private listTransactionsRepository: {
      execute: (query: any) => Promise<PaginatedTransactionResult>;
    }
  ) {}

  canHandle(query: GetBalanceTrendsQuery): boolean {
    return query instanceof GetBalanceTrendsQuery;
  }

  async handle(query: GetBalanceTrendsQuery): Promise<{
    month: string;
    income: number;
    expense: number;
    balance: number;
  }[]> {
    const { userEmail, months } = query.parameters;

    try {
      // Get transactions for the last N months
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const allTransactionsQuery = {
        pagination: { page: 1, limit: 10000 },
        sort: { sortBy: 'date' as const, order: 'asc' as const },
        search: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          query: undefined
        }
      };

      const result = await this.listTransactionsRepository.execute(allTransactionsQuery);

      // Filter by user email if specified
      const transactions = userEmail
        ? result.transactions.filter(t => t.userEmail === userEmail)
        : result.transactions;

      // Group by month and calculate trends
      const trends = this.calculateMonthlyTrends(transactions, months);

      return trends;
    } catch (error) {
      console.error('Failed to get balance trends:', error);
      throw new Error(`Failed to get balance trends: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateMonthlyTrends(transactions: Transaction[], months: number): {
    month: string;
    income: number;
    expense: number;
    balance: number;
  }[] {
    const trends: {
      month: string;
      income: number;
      expense: number;
      balance: number;
    }[] = [];

    // Initialize trends for each month
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format

      trends.push({
        month: this.formatMonthName(date),
        income: 0,
        expense: 0,
        balance: 0
      });
    }

    // Group transactions by month
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthKey = transactionDate.toISOString().slice(0, 7);

      const trendIndex = trends.findIndex(t => t.month === this.formatMonthName(transactionDate));

      if (trendIndex !== -1) {
        if (transaction.type === 'credit') {
          trends[trendIndex].income += transaction.amount;
        } else {
          trends[trendIndex].expense += transaction.amount;
        }
      }
    });

    // Calculate balance for each month
    let runningBalance = 0;
    trends.forEach(trend => {
      runningBalance += trend.income - trend.expense;
      trend.balance = runningBalance;
    });

    return trends;
  }

  private formatMonthName(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}

/**
 * Handler for searching transactions with multiple criteria
 */
export class SearchTransactionsQueryHandler implements IQueryHandler<SearchTransactionsQuery, PaginatedTransactionResult> {
  constructor(
    private listTransactionsRepository: {
      execute: (query: any) => Promise<PaginatedTransactionResult>;
    }
  ) {}

  canHandle(query: SearchTransactionsQuery): boolean {
    return query instanceof SearchTransactionsQuery;
  }

  async handle(query: SearchTransactionsQuery): Promise<PaginatedTransactionResult> {
    const {
      searchTerm,
      type,
      categories,
      dateRange,
      amountRange,
      userEmail,
      page,
      limit
    } = query.parameters;

    try {
      // Build query from search parameters
      const transactionQuery = {
        pagination: { page, limit },
        sort: { sortBy: 'date' as const, order: 'desc' as const },
        filters: {
          type,
          category: categories,
          includeUncategorized: categories?.includes('uncategorized')
        },
        search: {
          query: searchTerm,
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate
        }
      };

      const result = await this.listTransactionsRepository.execute(transactionQuery);

      // Apply additional filtering
      let filteredTransactions = result.transactions;

      // Filter by user email
      if (userEmail) {
        filteredTransactions = filteredTransactions.filter(t => t.userEmail === userEmail);
      }

      // Filter by amount range
      if (amountRange?.min !== undefined || amountRange?.max !== undefined) {
        filteredTransactions = filteredTransactions.filter(t => {
          if (amountRange?.min !== undefined && t.amount < amountRange.min) return false;
          if (amountRange?.max !== undefined && t.amount > amountRange.max) return false;
          return true;
        });
      }

      // Apply search term filtering (in case the repository doesn't support it)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredTransactions = filteredTransactions.filter(t =>
          t.observation?.toLowerCase().includes(searchLower) ||
          t.categories.some(cat => cat.toLowerCase().includes(searchLower))
        );
      }

      // Recalculate pagination
      const startIndex = (page - 1) * limit;
      const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + limit);

      return {
        transactions: paginatedTransactions,
        total: filteredTransactions.length,
        page,
        totalPages: Math.ceil(filteredTransactions.length / limit),
        hasNextPage: page * limit < filteredTransactions.length,
        hasPreviousPage: page > 1
      };
    } catch (error) {
      console.error('Failed to search transactions:', error);
      throw new Error(`Failed to search transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}