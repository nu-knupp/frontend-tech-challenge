import { create } from 'zustand';
import { Transaction } from '@/types/Transaction';
import api from '@/services/api';
import { formatValue } from '@/utils/currency';

interface TransactionState {
  balance: string;
  transactions: Transaction[];
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  createTransaction: (data: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, originalTransaction: Transaction, fieldsToUpdate: Partial<Transaction>) => Promise<void>;
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

  fetchTransactions: async () => {
    const res = await api.get<Transaction[]>('/transactions');
    set({ transactions: res.data });
  },

  fetchBalance: async () => {
    const res = await api.get<number>('/balance');
    set({ balance: formatValue(res.data) });
  },

  createTransaction: async (data) => {
    await api.post('/transactions', data);

    await get().fetchTransactions();
    await get().fetchBalance();
  },

  updateTransaction: async (id, originalTransaction, fieldsToUpdate) => {
    const updatedTransaction = getUpdatedFields(originalTransaction, fieldsToUpdate)
    await api.patch(`/transactions/${id}`, updatedTransaction);

    await get().fetchBalance();
    await get().fetchTransactions();
  },

  deleteTransaction: async (id) => {
    await api.delete(`/transactions/${id}`);

    await get().fetchBalance();
    await get().fetchTransactions();
  },
}));
