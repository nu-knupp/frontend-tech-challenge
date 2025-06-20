import { useMemo } from 'react';
import { Transaction } from '@/types/Transaction';
import { format, subDays, eachDayOfInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

        // Cálculos básicos
        const totalIncome = transactions
            .filter(t => t.type === 'credit')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'debit')
            .reduce((sum, t) => sum + t.amount, 0);

        const netFlow = totalIncome - totalExpenses;
        const transactionCount = transactions.length;
        const averageTransaction = transactionCount > 0 ? (totalIncome + totalExpenses) / transactionCount : 0;

        // Análise mensal
        const monthlyData = new Map<string, { income: number; expenses: number }>();

        transactions.forEach(transaction => {
            const monthKey = format(parseISO(transaction.date), 'MMM yyyy', { locale: ptBR });

            if (!monthlyData.has(monthKey)) {
                monthlyData.set(monthKey, { income: 0, expenses: 0 });
            }

            const monthData = monthlyData.get(monthKey)!;
            if (transaction.type === 'credit') {
                monthData.income += transaction.amount;
            } else {
                monthData.expenses += transaction.amount;
            }
        });

        const monthlyTrends: MonthlyTrend[] = Array.from(monthlyData.entries())
            .map(([month, data]) => ({
                month,
                income: data.income,
                expenses: data.expenses,
                net: data.income - data.expenses,
            }))
            .sort((a, b) => a.month.localeCompare(b.month));

        // Fluxo de caixa diário (últimos 30 dias)
        const thirtyDaysAgo = subDays(new Date(), 30);
        const days = eachDayOfInterval({ start: thirtyDaysAgo, end: new Date() });

        let runningBalance = 0;
        const dailyCashFlow: DailyCashFlow[] = days.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const dayTransactions = transactions.filter(t => t.date.startsWith(dayStr));

            const dayIncome = dayTransactions
                .filter(t => t.type === 'credit')
                .reduce((sum, t) => sum + t.amount, 0);

            const dayExpenses = dayTransactions
                .filter(t => t.type === 'debit')
                .reduce((sum, t) => sum + t.amount, 0);

            runningBalance += dayIncome - dayExpenses;

            return {
                date: format(day, 'dd/MM'),
                balance: runningBalance,
                income: dayIncome,
                expenses: dayExpenses,
            };
        });

        // Crescimento mensal
        const incomeGrowth = monthlyTrends.length >= 2
            ? ((monthlyTrends[monthlyTrends.length - 1].income - monthlyTrends[monthlyTrends.length - 2].income) / monthlyTrends[monthlyTrends.length - 2].income) * 100
            : 0;

        const expenseGrowth = monthlyTrends.length >= 2
            ? ((monthlyTrends[monthlyTrends.length - 1].expenses - monthlyTrends[monthlyTrends.length - 2].expenses) / monthlyTrends[monthlyTrends.length - 2].expenses) * 100
            : 0;

        // Taxa de poupança
        const savingsRate = totalIncome > 0 ? (netFlow / totalIncome) * 100 : 0;

        // Maiores transações
        const expenseTransactions = transactions.filter(t => t.type === 'debit');
        const incomeTransactions = transactions.filter(t => t.type === 'credit');

        const largestExpense = expenseTransactions.length > 0
            ? Math.max(...expenseTransactions.map(t => t.amount))
            : 0;

        const largestIncome = incomeTransactions.length > 0
            ? Math.max(...incomeTransactions.map(t => t.amount))
            : 0;

        // Dia mais ativo
        const dailyActivity = new Map<string, number>();
        transactions.forEach(transaction => {
            const dayName = format(parseISO(transaction.date), 'EEEE', { locale: ptBR });
            dailyActivity.set(dayName, (dailyActivity.get(dayName) || 0) + 1);
        });

        const mostActiveDay = Array.from(dailyActivity.entries())
            .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

        // Gasto médio diário
        const uniqueDays = new Set(transactions.map(t => t.date.split('T')[0]));
        const averageDailySpending = uniqueDays.size > 0 ? totalExpenses / uniqueDays.size : 0;

        return {
            totalIncome,
            totalExpenses,
            netFlow,
            transactionCount,
            averageTransaction,
            monthlyTrends,
            dailyCashFlow,
            incomeGrowth,
            expenseGrowth,
            savingsRate,
            largestExpense,
            largestIncome,
            mostActiveDay,
            averageDailySpending,
        };
    }, [transactions]);
}