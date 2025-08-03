import { create } from 'zustand';
import { Transaction } from '@/types/Transaction';
import api from '@/services/api';
import { formatValue } from '@/utils/currency';

interface TransactionState {
  balance: string;
  transactions: Transaction[];
  page: number;
  totalPages: number;
  loading: boolean;
  fetchBalance: () => Promise<void>;
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
}

export function getUpdatedFields<T extends object>(
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

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  balance: "0",
  page: 1,
  totalPages: 1,
  loading: false,

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

    set((state) => ({
      transactions: page === 1 ? transactions : [...state.transactions, ...transactions],
      page,
      totalPages,
      loading: false,
    }));
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
    const { page, totalPages, loading } = get();
    if (loading || page >= totalPages) return;

    await get().fetchTransactions(page + 1, sortBy, sort, type, category, q, startDate, endDate);
  },

  fetchBalance: async () => {
    const res = await api.get<number>('/balance');
    set({ balance: formatValue(res.data) });
  },

  createTransaction: async (data) => {
    await api.post('/transactions', data);
    await get().fetchTransactions(1);
    await get().fetchBalance();
  },

  updateTransaction: async (id, originalTransaction, fieldsToUpdate) => {
    const updatedTransaction = getUpdatedFields(originalTransaction, fieldsToUpdate);
    await api.patch(`/transactions/${id}`, updatedTransaction);
    await get().fetchTransactions(1);
    await get().fetchBalance();
  },

  deleteTransaction: async (id) => {
    await api.delete(`/transactions/${id}`);
    await get().fetchTransactions(1);
    await get().fetchBalance();
  },
}));
