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
  secure?: boolean; // Indica se os campos sensíveis estão criptografados
};

export type TransactionFormInput = {
  type: TransactionType | "";
  date: string;
  amount: number;
  observation: string;
};

export type TransactionFilterType = TransactionType | undefined;

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
