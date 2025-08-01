export interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  category: string;
  description?: string;
}
