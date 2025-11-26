'use client';

import { create } from 'zustand';
import { Transaction } from '@banking/shared-types';
import { formatValue } from '@banking/shared-utils';
import { MiddlewarePipeline } from './middleware/MiddlewarePipeline';
import { LoggingMiddleware } from './middleware/transaction/LoggingMiddleware';
import { CacheMiddleware } from './middleware/transaction/CacheMiddleware';
import { PersistenceMiddleware } from './middleware/transaction/PersistenceMiddleware';
import { PerformanceMiddleware } from './middleware/transaction/PerformanceMiddleware';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

interface TransactionState {
  balance: string;
  transactions: Transaction[];
  page: number;
  totalPages: number;
  loading: boolean;

  // Enhanced methods with middleware support
  fetchTransactions: (
    page?: number,
    sortBy?: keyof Transaction,
    sort?: 'asc' | 'desc',
    type?: 'credit' | 'debit',
    category?: string[],
    q?: string,
    startDate?: string,
    endDate?: string
  ) => Promise<void>;

  fetchNextPage: (
    sortBy?: keyof Transaction,
    sort?: 'asc' | 'desc',
    type?: 'credit' | 'debit',
    category?: string[],
    q?: string,
    startDate?: string,
    endDate?: string
  ) => Promise<void>;

  deleteTransaction: (id: string) => Promise<void>;
  createTransaction: (data: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (
    id: string,
    originalTransaction: Transaction,
    fieldsToUpdate: Partial<Transaction>
  ) => Promise<void>;

  fetchBalance: () => Promise<void>;

  // Middleware management methods
  getMiddlewareStats: () => any;
  getPerformanceReport: () => any;
  clearCache: () => void;
  clearPersistedState: () => void;
}

/**
 * Enhanced Transaction Store with Middleware Pipeline
 * Provides advanced features like caching, persistence, logging, and performance monitoring
 */
export function createEnhancedTransactionStore() {
  // Initialize middleware pipeline
  const pipeline = new MiddlewarePipeline<any, any>('TransactionStore');

  // Create middlewares
  const loggingMiddleware = new LoggingMiddleware({
    enabled: process.env.NODE_ENV === 'development',
    excludeActions: [''] // Log all actions in development
  });

  const cacheMiddleware = new CacheMiddleware({
    enabled: true,
    defaultTTL: 5 * 60 * 1000 // 5 minutes
  });

  const persistenceMiddleware = new PersistenceMiddleware('transaction', {
    storageKey: 'banking_transactions_state',
    enabled: true
  });

  const performanceMiddleware = new PerformanceMiddleware({
    enabled: true,
    slowActionThreshold: 1000, // 1 second
    maxSlowActions: 20
  });

  // Add middlewares to pipeline
  pipeline.add(loggingMiddleware);
  pipeline.add(cacheMiddleware);
  pipeline.add(persistenceMiddleware);
  pipeline.add(performanceMiddleware);

  // Load persisted state if available
  const persistedState = persistenceMiddleware.load();
  const initialState = {
    transactions: [],
    balance: "0",
    page: 1,
    totalPages: 1,
    loading: false
  };

  const validPersistedState = persistedState && persistenceMiddleware.validateState(persistedState)
    ? persistenceMiddleware.mergeWithInitialState(persistedState, initialState)
    : initialState;

  const useStore = create<TransactionState>((set, get) => ({
    // Ensure all required properties are present with defaults
    balance: (validPersistedState as any)?.balance ?? "0",
    transactions: (validPersistedState as any)?.transactions ?? [],
    page: (validPersistedState as any)?.page ?? 1,
    totalPages: (validPersistedState as any)?.totalPages ?? 1,
    loading: (validPersistedState as any)?.loading ?? false,

    fetchTransactions: async (
      page = 1,
      sortBy = 'date',
      sort = 'desc',
      type,
      category,
      q,
      startDate,
      endDate
    ) => {
      const endTiming = performanceMiddleware.startTiming('fetchTransactions');
      const currentState = get();

      try {
        // Check cache first
        const cacheKey = cacheMiddleware.generateCacheKey('fetchTransactions', {
          page, sortBy, sort, type, category, q, startDate, endDate
        });

        const cachedResult = cacheMiddleware.get(cacheKey);
        if (cachedResult) {
          loggingMiddleware.log(
            { storeName: 'TransactionStore', action: 'fetchTransactions', timestamp: new Date() },
            cachedResult,
            currentState
          );

          set({
            transactions: page === 1 ? cachedResult.transactions : [...currentState.transactions, ...cachedResult.transactions],
            page,
            totalPages: cachedResult.totalPages,
            loading: false
          });

          endTiming();
          return;
        }

        // Set loading state
        set({ loading: true });

        const res = await api.get('/transactions', {
          params: {
            page,
            sortBy,
            sort,
            type,
            category,
            q,
            startDate,
            endDate,
          },
          paramsSerializer: (params) => {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                value.forEach((v) => searchParams.append(key, v));
              } else if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
              }
            });
            return searchParams.toString();
          }
        });

        let { transactions, totalPages } = res.data;

        if (category?.includes("Outros")) {
          const knownCategories = category.filter((c) => c !== "Outros");
          transactions = transactions.filter((t: Transaction) => {
            const hasKnown = t.categories?.some(cat =>
              knownCategories.includes(cat)
            );
            return !hasKnown;
          });
        }

        const newState = {
          transactions: page === 1 ? transactions : [...currentState.transactions, ...transactions],
          page,
          totalPages,
          loading: false,
        };

        // Cache the result
        cacheMiddleware.set(cacheKey, { transactions, totalPages });

        set(newState);
        persistenceMiddleware.save(newState);

        loggingMiddleware.log(
          { storeName: 'TransactionStore', action: 'fetchTransactions', timestamp: new Date() },
          newState,
          currentState
        );

      } catch (error) {
        performanceMiddleware.recordError('fetchTransactions', error);
        console.error('Failed to fetch transactions:', error);
        set({ loading: false });
      } finally {
        endTiming();
      }
    },

    fetchNextPage: async (
      sortBy = 'date',
      sort = 'desc',
      type,
      category,
      q,
      startDate,
      endDate
    ) => {
      const endTiming = performanceMiddleware.startTiming('fetchNextPage');

      try {
        const { page, totalPages, loading } = get();
        if (loading || page >= totalPages) {
          endTiming();
          return;
        }

        await get().fetchTransactions(page + 1, sortBy, sort, type, category, q, startDate, endDate);
      } finally {
        endTiming();
      }
    },

    fetchBalance: async () => {
      const endTiming = performanceMiddleware.startTiming('fetchBalance');

      try {
        // Check cache first
        const cachedBalance = cacheMiddleware.get('balance');
        if (cachedBalance) {
          set({ balance: cachedBalance });
          endTiming();
          return;
        }

        const res = await api.get<number>('/balance');
        const formattedBalance = formatValue(res.data);

        set({ balance: formattedBalance });
        cacheMiddleware.set('balance', formattedBalance);
        persistenceMiddleware.save({ ...get(), balance: formattedBalance });

      } catch (error) {
        performanceMiddleware.recordError('fetchBalance', error);
        console.error('Failed to fetch balance:', error);
      } finally {
        endTiming();
      }
    },

    createTransaction: async (data) => {
      const endTiming = performanceMiddleware.startTiming('createTransaction');
      const currentState = get();

      try {
        await api.post('/transactions', data);

        // Invalidate cache after mutation
        cacheMiddleware.invalidate('fetchTransactions');
        cacheMiddleware.delete('balance');

        await get().fetchTransactions(1);
        await get().fetchBalance();

      } catch (error) {
        performanceMiddleware.recordError('createTransaction', error);
        console.error('Failed to create transaction:', error);
        throw error;
      } finally {
        endTiming();
      }
    },

    updateTransaction: async (id, originalTransaction, fieldsToUpdate) => {
      const endTiming = performanceMiddleware.startTiming('updateTransaction');

      try {
        const updatedTransaction = getUpdatedFields(originalTransaction, fieldsToUpdate);
        await api.patch(`/transactions/${id}`, updatedTransaction);

        // Invalidate cache after mutation
        cacheMiddleware.invalidate('fetchTransactions');
        cacheMiddleware.delete('balance');

        await get().fetchTransactions(1);
        await get().fetchBalance();

      } catch (error) {
        performanceMiddleware.recordError('updateTransaction', error);
        console.error('Failed to update transaction:', error);
        throw error;
      } finally {
        endTiming();
      }
    },

    deleteTransaction: async (id) => {
      const endTiming = performanceMiddleware.startTiming('deleteTransaction');

      try {
        await api.delete(`/transactions/${id}`);

        // Invalidate cache after mutation
        cacheMiddleware.invalidate('fetchTransactions');
        cacheMiddleware.delete('balance');

        await get().fetchTransactions(1);
        await get().fetchBalance();

      } catch (error) {
        performanceMiddleware.recordError('deleteTransaction', error);
        console.error('Failed to delete transaction:', error);
        throw error;
      } finally {
        endTiming();
      }
    },

    // Middleware management methods
    getMiddlewareStats: () => pipeline.getStats(),

    getPerformanceReport: () => performanceMiddleware.generateReport(),

    clearCache: () => cacheMiddleware.clear(),

    clearPersistedState: () => {
      persistenceMiddleware.clear();
      set({
        transactions: [],
        balance: "0",
        page: 1,
        totalPages: 1,
        loading: false
      });
    }
  }));

  return useStore;
}

function getUpdatedFields<T extends object>(
  original: T,
  updated: Partial<T>
): Partial<T> {
  const changed: Partial<T> = {};

  Object.keys(updated).forEach((key) => {
    const typedKey = key as keyof T;

    if (
      updated[typedKey] !== undefined &&
      updated[typedKey] !== original[typedKey]
    ) {
      changed[typedKey] = updated[typedKey];
    }
  });

  return changed;
}

// Export the enhanced store instance
export const useEnhancedTransactionStore = createEnhancedTransactionStore();

// Export utilities for middleware management
export {
  LoggingMiddleware,
  CacheMiddleware,
  PersistenceMiddleware,
  PerformanceMiddleware
};