import { create } from 'zustand';
import { Transaction } from '../../types/Transaction';
import api from '../../services/api';
import { formatValue } from '../../utils/currency';

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
    type?: 'credit' | 'debit'
  ) => Promise<void>;
  fetchNextPage: (
    sortBy?: keyof Transaction,
    sort?: 'asc' | 'desc',
    type?: 'credit' | 'debit'
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
    type?: 'credit' | 'debit'
  ) => {
    set({ loading: true });
    const res = await api.get('/transactions', {
      params: {
        page,
        sortBy,
        sort,
        type,
      },
    });
    const { transactions, totalPages } = res.data;
    set((state) => ({
      transactions: page === 1 ? transactions : [...state.transactions, ...transactions],
      totalPages,
      page,
      loading: false,
    }));
  },
  fetchBalance: async () => {
    set({ loading: true });
    const res = await api.get('/balance');
    set({ balance: formatValue(res.data.balance), loading: false });
  },
  fetchNextPage: async (
    sortBy = 'date',
    sort = 'desc',
    type?: 'credit' | 'debit'
  ) => {
    const { page, totalPages } = get();
    if (page < totalPages) {
      await get().fetchTransactions(page + 1, sortBy, sort, type);
    }
  },
  deleteTransaction: async (id: string) => {
    set({ loading: true });
    await api.delete(`/transactions/${id}`);
    await get().fetchTransactions();
    set({ loading: false });
  },
  createTransaction: async (data: Omit<Transaction, 'id'>) => {
    set({ loading: true });
    await api.post('/transactions', data);
    await get().fetchTransactions();
    set({ loading: false });
  },
  updateTransaction: async (
    id,
    originalTransaction,
    fieldsToUpdate
  ) => {
    set({ loading: true });
    const updatedFields = getUpdatedFields(originalTransaction, fieldsToUpdate);
    await api.put(`/transactions/${id}`, updatedFields);
    await get().fetchTransactions();
    set({ loading: false });
  },
}));
