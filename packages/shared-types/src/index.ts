export type TransactionType = 'credit' | 'debit';

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  observation?: string;
  type: TransactionType;
  file?: string | null;
  fileName?: string | null;
  categories: string[] | [];
  userEmail?: string; // Email do usuário que criou a transação
};

export type TransactionFormInput = {
  type: TransactionType | "";
  date: string;
  amount: number;
  observation: string;
};

export type TransactionFilterType = TransactionType | undefined;

// Query Objects for Clean Architecture
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SortOptions {
  sortBy: 'date' | 'amount' | 'description';
  order: 'asc' | 'desc';
}

export interface FilterOptions {
  type?: TransactionType;
  categories?: string[];
  includeUncategorized?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface SearchOptions {
  query?: string;
  fields?: string[];
}

export interface TransactionQuery {
  pagination: PaginationOptions;
  sort?: SortOptions;
  filters?: FilterOptions;
  search?: SearchOptions;
}

export interface PaginatedTransactionResult {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  userName: string;
}

// Result Pattern
export * from './Result';

// Domain Layer - Value Objects
export * from './domain';
