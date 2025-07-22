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
};

export type TransactionFormInput = {
  type: TransactionType | "";
  date: string;
  amount: number;
  observation: string;
};

export type TransactionFilterType = TransactionType | undefined;
