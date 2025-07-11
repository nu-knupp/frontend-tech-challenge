import React from 'react';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';
import { MonthlyTrend } from '@/hooks/useFinancialAnalytics';

interface MonthlyTrendChartProps {
    data: MonthlyTrend[];
}

export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
    const formatCurrency = (value: number) =>
        `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    return (
        <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 14 }} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 14 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend wrapperStyle={{ paddingTop: 15 }} />
                <Bar dataKey="income" fill="#4caf50" name="Receitas" />
                <Bar dataKey="expenses" fill="#f44336" name="Despesas" />
                <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#2196f3"
                    strokeWidth={3}
                    name="Saldo Líquido"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}