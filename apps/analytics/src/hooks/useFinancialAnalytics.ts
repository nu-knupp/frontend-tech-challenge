import { useMemo } from 'react';
interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  category: string;
  description?: string;
}
export interface MonthlyTrend {
    month: string;
    income: number;
    expenses: number;
    net: number;
}
export interface DailyCashFlow {
    date: string;
    balance: number;
    income: number;
    expenses: number;
}
export interface FinancialAnalytics {
    totalIncome: number;
    totalExpenses: number;
    netFlow: number;
    transactionCount: number;
    averageTransaction: number;
    monthlyTrends: MonthlyTrend[];
    dailyCashFlow: DailyCashFlow[];
    incomeGrowth: number;
    expenseGrowth: number;
    savingsRate: number;
    largestExpense: number;
    largestIncome: number;
    mostActiveDay: string;
    averageDailySpending: number;
}
export function useFinancialAnalytics(transactions: Transaction[]): FinancialAnalytics {
    return useMemo(() => {
        if (!transactions.length) {
            return {
                totalIncome: 0,
                totalExpenses: 0,
                netFlow: 0,
                transactionCount: 0,
                averageTransaction: 0,
                monthlyTrends: [],
                dailyCashFlow: [],
                incomeGrowth: 0,
                expenseGrowth: 0,
                savingsRate: 0,
                largestExpense: 0,
                largestIncome: 0,
                mostActiveDay: '',
                averageDailySpending: 0,
            };
        }
        // ...implemente os cálculos conforme necessário...
        return {
          totalIncome: 0,
          totalExpenses: 0,
          netFlow: 0,
          transactionCount: 0,
          averageTransaction: 0,
          monthlyTrends: [],
          dailyCashFlow: [],
          incomeGrowth: 0,
          expenseGrowth: 0,
          savingsRate: 0,
          largestExpense: 0,
          largestIncome: 0,
          mostActiveDay: '',
          averageDailySpending: 0,
        };
    }, [transactions]);
}
