import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';

interface CategoryChartProps {
    income: number;
    expenses: number;
}

export default function CategoryChart({ income, expenses }: CategoryChartProps) {
    const data = [
        { name: 'Receitas', value: income, color: '#4caf50' },
        { name: 'Despesas', value: expenses, color: '#f44336' },
    ];

    const formatCurrency = (value: number) =>
        `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    return (
        <ResponsiveContainer
            width="100%"
            height="90%"
        >
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}