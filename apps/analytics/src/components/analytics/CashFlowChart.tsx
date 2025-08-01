import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DailyCashFlow } from '../../hooks/useFinancialAnalytics';
interface CashFlowChartProps {
  data: DailyCashFlow[];
}
export default function CashFlowChart({ data }: CashFlowChartProps) {
  const formatCurrency = (value: number) =>
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  return (
    <ResponsiveContainer width="100%" height="90%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 14 }} />
        <YAxis yAxisId="left" tickFormatter={formatCurrency} tick={{ fontSize: 14 }} />
        <YAxis yAxisId="right" orientation="right" tickFormatter={formatCurrency} tick={{ fontSize: 14 }} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend wrapperStyle={{
          position: 'absolute',
          left: 20,
          bottom: 0,
          height: 'auto',
          width: 'auto',
        }} />
        <Bar yAxisId="left" dataKey="income" fill="#4caf50" name="Entradas" />
        <Bar yAxisId="left" dataKey="expenses" fill="#f44336" name="Saídas" />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="balance"
          stroke="#2196f3"
          strokeWidth={2}
          name="Saldo Acumulado"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
