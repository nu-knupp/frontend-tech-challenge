import { IQuery } from '../IQuery';
import { TransactionQuery, PaginatedTransactionResult, Transaction } from "@banking/shared-types";

/**
 * Query to list transactions with filtering and pagination
 */
export class ListTransactionsQuery implements IQuery<TransactionQuery, PaginatedTransactionResult> {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly metadata?: Record<string, any>;
  public readonly parameters: TransactionQuery;

  constructor(query: TransactionQuery, metadata?: Record<string, any>) {
    this.id = crypto.randomUUID();
    this.timestamp = new Date();
    this.parameters = query;
    this.metadata = metadata;
  }
}

/**
 * Query to get a specific transaction by ID
 */
export class GetTransactionByIdQuery implements IQuery<{ id: string }, Transaction | null> {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly metadata?: Record<string, any>;
  public readonly parameters: { id: string };

  constructor(transactionId: string, metadata?: Record<string, any>) {
    this.id = crypto.randomUUID();
    this.timestamp = new Date();
    this.parameters = { id: transactionId };
    this.metadata = metadata;
  }
}

/**
 * Query to get transaction statistics
 */
export class GetTransactionStatsQuery implements IQuery<{
  userEmail?: string;
  startDate?: string;
  endDate?: string;
}, {
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  creditCount: number;
  debitCount: number;
  creditTotal: number;
  debitTotal: number;
}> {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly metadata?: Record<string, any>;
  public readonly parameters: {
    userEmail?: string;
    startDate?: string;
    endDate?: string;
  };

  constructor(
    params: {
      userEmail?: string;
      startDate?: string;
      endDate?: string;
    },
    metadata?: Record<string, any>
  ) {
    this.id = crypto.randomUUID();
    this.timestamp = new Date();
    this.parameters = params;
    this.metadata = metadata;
  }
}

/**
 * Query to get monthly balance trends
 */
export class GetBalanceTrendsQuery implements IQuery<{
  userEmail?: string;
  months: number;
}, {
  month: string;
  income: number;
  expense: number;
  balance: number;
}[]> {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly metadata?: Record<string, any>;
  public readonly parameters: {
    userEmail?: string;
    months: number;
  };

  constructor(
    params: {
      userEmail?: string;
      months: number;
    },
    metadata?: Record<string, any>
  ) {
    this.id = crypto.randomUUID();
    this.timestamp = new Date();
    this.parameters = params;
    this.metadata = {
      ...metadata,
      months: params.months,
    };
  }
}

/**
 * Query to search transactions across multiple criteria
 */
export class SearchTransactionsQuery implements IQuery<{
  searchTerm?: string;
  type?: 'credit' | 'debit';
  categories?: string[];
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
  amountRange?: {
    min?: number;
    max?: number;
  };
  userEmail?: string;
  page: number;
  limit: number;
}, PaginatedTransactionResult> {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly metadata?: Record<string, any>;
  public readonly parameters: {
    searchTerm?: string;
    type?: 'credit' | 'debit';
    categories?: string[];
    dateRange?: {
      startDate?: string;
      endDate?: string;
    };
    amountRange?: {
      min?: number;
      max?: number;
    };
    userEmail?: string;
    page: number;
    limit: number;
  };

  constructor(
    params: {
      searchTerm?: string;
      type?: 'credit' | 'debit';
      categories?: string[];
      dateRange?: {
        startDate?: string;
        endDate?: string;
      };
      amountRange?: {
        min?: number;
        max?: number;
      };
      userEmail?: string;
      page: number;
      limit: number;
    },
    metadata?: Record<string, any>
  ) {
    this.id = crypto.randomUUID();
    this.timestamp = new Date();
    this.parameters = params;
    this.metadata = {
      ...metadata,
      searchComplexity: this.calculateSearchComplexity(params),
    };
  }

  private calculateSearchComplexity(params: any): 'low' | 'medium' | 'high' {
    let complexity = 0;
    if (params.searchTerm) complexity++;
    if (params.type) complexity++;
    if (params.categories?.length) complexity++;
    if (params.dateRange?.startDate || params.dateRange?.endDate) complexity++;
    if (params.amountRange?.min || params.amountRange?.max) complexity++;

    if (complexity <= 1) return 'low';
    if (complexity <= 3) return 'medium';
    return 'high';
  }
}