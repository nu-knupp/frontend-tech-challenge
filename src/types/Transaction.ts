export type TransactionType = 'credit' | 'debit';

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  observation?: string;
  type: TransactionType;
  file?: string;
  fileName?: string;
};

export type TransactionFormInput = {
  type: TransactionType | "";
  date: string;
  amount: number;
  observation: string;
};