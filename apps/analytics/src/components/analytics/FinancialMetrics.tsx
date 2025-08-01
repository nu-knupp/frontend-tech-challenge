import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Savings,
  CalendarToday,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { FinancialAnalytics } from '../../hooks/useFinancialAnalytics';
interface FinancialMetricsProps {
  analytics: FinancialAnalytics;
}
export default function FinancialMetrics({ analytics }: FinancialMetricsProps) {
  const formatCurrency = (value: number) =>
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  const formatPercentage = (value: number) =>
    `${value.toFixed(1)}%`;
  return (
    <Grid container spacing={3}>
      <Grid>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingUp color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Crescimento de Receitas</Typography>
            </Box>
            <Typography variant="h4" color={analytics.incomeGrowth >= 0 ? 'success.main' : 'error.main'}>
              {formatPercentage(analytics.incomeGrowth)}
            </Typography>
            <Chip
              label={analytics.incomeGrowth >= 0 ? "Crescimento" : "Declínio"}
              color={analytics.incomeGrowth >= 0 ? "success" : "error"}
              size="small"
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>
      </Grid>
      {/* ...existing code... */}
    </Grid>
  );
}
