import { TransactionQuery, PaginationOptions, SortOptions, FilterOptions, SearchOptions, TransactionType } from "@banking/shared-types";

/**
 * Builder Pattern for Transaction Queries
 * Provides a fluent interface for building complex transaction queries
 */
export class TransactionQueryBuilder {
  private query: Partial<TransactionQuery> = {};

  constructor(pagination: PaginationOptions) {
    this.query.pagination = pagination;
  }

  /**
   * Add sorting options to the query
   */
  sortBy(sortBy: 'date' = 'date', order: 'asc' | 'desc' = 'desc'): TransactionQueryBuilder {
    this.query.sort = { sortBy, order };
    return this;
  }

  /**
   * Filter by transaction type
   */
  filterByType(type?: TransactionType): TransactionQueryBuilder {
    if (!this.query.filters) {
      this.query.filters = {};
    }
    this.query.filters.type = type;
    return this;
  }

  /**
   * Filter by categories
   */
  filterByCategories(categories?: string[]): TransactionQueryBuilder {
    if (!this.query.filters) {
      this.query.filters = {};
    }
    this.query.filters.category = categories;
    return this;
  }

  /**
   * Include or exclude uncategorized transactions
   */
  includeUncategorized(include: boolean = true): TransactionQueryBuilder {
    if (!this.query.filters) {
      this.query.filters = {};
    }
    this.query.filters.includeUncategorized = include;
    return this;
  }

  /**
   * Search by text query
   */
  searchByText(query?: string): TransactionQueryBuilder {
    if (!this.query.search) {
      this.query.search = {};
    }
    this.query.search.query = query;
    return this;
  }

  /**
   * Filter by date range
   */
  filterByDateRange(startDate?: string, endDate?: string): TransactionQueryBuilder {
    if (!this.query.search) {
      this.query.search = {};
    }
    this.query.search.startDate = startDate;
    this.query.search.endDate = endDate;
    return this;
  }

  /**
   * Set all filter options at once
   */
  withFilters(filters: FilterOptions): TransactionQueryBuilder {
    this.query.filters = { ...this.query.filters, ...filters };
    return this;
  }

  /**
   * Set all search options at once
   */
  withSearch(search: SearchOptions): TransactionQueryBuilder {
    this.query.search = { ...this.query.search, ...search };
    return this;
  }

  /**
   * Build the final query object
   */
  build(): TransactionQuery {
    if (!this.query.pagination) {
      throw new Error('Pagination is required for TransactionQuery');
    }

    return {
      pagination: this.query.pagination,
      sort: this.query.sort,
      filters: this.query.filters,
      search: this.query.search,
    } as TransactionQuery;
  }

  /**
   * Create a new builder instance
   */
  static create(pagination: PaginationOptions): TransactionQueryBuilder {
    return new TransactionQueryBuilder(pagination);
  }

  /**
   * Create a builder with default values
   */
  static withDefaults(): TransactionQueryBuilder {
    return new TransactionQueryBuilder({ page: 1, limit: 10 })
      .sortBy('date', 'desc');
  }

  /**
   * Create a builder from existing query
   */
  static fromQuery(query: TransactionQuery): TransactionQueryBuilder {
    const builder = new TransactionQueryBuilder(query.pagination);

    if (query.sort) {
      builder.sortBy(query.sort.sortBy, query.sort.order);
    }

    if (query.filters) {
      builder.withFilters(query.filters);
    }

    if (query.search) {
      builder.withSearch(query.search);
    }

    return builder;
  }
}

/**
 * Factory function for common query patterns
 */
export const TransactionQueryFactory = {
  /**
   * Create a query for recent transactions (last 30 days)
   */
  recentTransactions(page: number = 1, limit: number = 10): TransactionQuery {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return TransactionQueryBuilder.create({ page, limit })
      .sortBy('date', 'desc')
      .filterByDateRange(thirtyDaysAgo.toISOString().split('T')[0], undefined)
      .build();
  },

  /**
   * Create a query for transactions by type
   */
  byType(type: TransactionType, page: number = 1, limit: number = 10): TransactionQuery {
    return TransactionQueryBuilder.create({ page, limit })
      .sortBy('date', 'desc')
      .filterByType(type)
      .build();
  },

  /**
   * Create a query for transactions by category
   */
  byCategory(category: string, page: number = 1, limit: number = 10): TransactionQuery {
    return TransactionQueryBuilder.create({ page, limit })
      .sortBy('date', 'desc')
      .filterByCategories([category])
      .build();
  },

  /**
   * Create a search query
   */
  search(searchTerm: string, page: number = 1, limit: number = 10): TransactionQuery {
    return TransactionQueryBuilder.create({ page, limit })
      .sortBy('date', 'desc')
      .searchByText(searchTerm)
      .build();
  },

  /**
   * Create a query for uncategorized transactions only
   */
  uncategorizedOnly(page: number = 1, limit: number = 10): TransactionQuery {
    return TransactionQueryBuilder.create({ page, limit })
      .sortBy('date', 'desc')
      .includeUncategorized(true)
      .build();
  }
};