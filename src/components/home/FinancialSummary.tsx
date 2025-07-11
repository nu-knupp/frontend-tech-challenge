import React, { useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Chip,
    LinearProgress,
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    Assessment,
    CalendarToday,
} from '@mui/icons-material';
import { useTransactionStore } from '@/hooks/useTransactionStore';
import { useFinancialAnalytics } from '@/hooks/useFinancialAnalytics';

export default function FinancialSummary() {
    const { transactions, fetchTransactions } = useTransactionStore();
    const analytics = useFinancialAnalytics(transactions);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const formatCurrency = (value: number) =>
        value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

    if (transactions.length === 0) {
        return (
            <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Adicione suas primeiras transações para ver as análises
                </Typography>
            </Card>
        );
    }

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center", color: "primary.main" }}>
                Resumo Financeiro
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                {/* Fluxo Líquido */}
                <Card>
                    <CardContent sx={{ p: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <Assessment color={analytics.netFlow >= 0 ? 'success' : 'error'} sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                                Fluxo Líquido
                            </Typography>
                        </Box>
                        <Typography
                            variant="h4"
                            color={analytics.netFlow >= 0 ? 'success.main' : 'error.main'}
                            fontWeight="bold">
                            R$ {formatCurrency(analytics.netFlow)}
                        </Typography>
                        <Chip
                            label={analytics.netFlow >= 0 ? "Positivo" : "Negativo"}
                            color={analytics.netFlow >= 0 ? "success" : "error"}
                            size="small"
                            sx={{ mt: 1 }} />
                    </CardContent>
                </Card>

                {/* Taxa de Poupança */}
                <Card>
                    <CardContent sx={{ p: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <TrendingUp color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                                Taxa de Poupança
                            </Typography>
                        </Box>
                        <Typography
                            variant="h4"
                            color={analytics.savingsRate >= 0 ? 'success.main' : 'error.main'}
                            fontWeight="bold">
                            {formatPercentage(analytics.savingsRate)}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min(Math.abs(analytics.savingsRate), 100)}
                            color={analytics.savingsRate >= 0 ? "success" : "error"}
                            sx={{ mt: 2, height: 6, borderRadius: 3 }} />
                    </CardContent>
                </Card>

                {/* Crescimento de Receitas */}
                <Card>
                    <CardContent sx={{ p: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <TrendingUp color="success" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                                Crescimento Receitas
                            </Typography>
                        </Box>
                        <Typography
                            variant="h4"
                            color={analytics.incomeGrowth >= 0 ? 'success.main' : 'error.main'}
                            fontWeight="bold">
                            {formatPercentage(analytics.incomeGrowth)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            vs. mês anterior
                        </Typography>
                    </CardContent>
                </Card>

                {/* Dia Mais Ativo */}
                <Card>
                    <CardContent sx={{ p: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <CalendarToday color="info" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                                Dia Mais Ativo
                            </Typography>
                        </Box>
                        <Typography variant="h5" color="primary.main" fontWeight="bold">
                            {analytics.mostActiveDay || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {analytics.transactionCount} transações
                        </Typography>
                    </CardContent>
                </Card>

                {/* Resumo de Transações */}
                <Card>
                    <CardContent sx={{ p: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                        <Typography variant="h6" gutterBottom>
                            Resumo do Período
                        </Typography>
                        <Grid container spacing={2}>
                            <Box textAlign="center" p={2} sx={{ bgcolor: 'success.light', borderRadius: 2 }}>
                                <Typography variant="h5" color="success.contrastText" fontWeight="bold">
                                    R$ {formatCurrency(analytics.totalIncome)}
                                </Typography>
                                <Typography variant="body2" color="success.contrastText" sx={{ mt: 1 }}>
                                    Total Receitas
                                </Typography>
                            </Box>
                            <Box textAlign="center" p={2} sx={{ bgcolor: 'error.light', borderRadius: 2 }}>
                                <Typography variant="h5" color="error.contrastText" fontWeight="bold">
                                    R$ {formatCurrency(analytics.totalExpenses)}
                                </Typography>
                                <Typography variant="body2" color="error.contrastText" sx={{ mt: 1 }}>
                                    Total Despesas
                                </Typography>
                            </Box>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Maiores Transações */}
                <Card>
                    <CardContent sx={{ p: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                        <Typography variant="h6" gutterBottom>
                            Maiores Transações
                        </Typography>
                        <Grid container spacing={2}>
                            <Box textAlign="center" p={2} sx={{ bgcolor: 'primary.light', borderRadius: 2 }}>
                                <Typography variant="h5" color="primary.contrastText" fontWeight="bold">
                                    R$ {formatCurrency(analytics.largestIncome)}
                                </Typography>
                                <Typography variant="body2" color="primary.contrastText" sx={{ mt: 1 }}>
                                    Maior Receita
                                </Typography>
                            </Box>
                            <Box textAlign="center" p={2} sx={{ bgcolor: 'warning.light', borderRadius: 2 }}>
                                <Typography variant="h5" color="warning.contrastText" fontWeight="bold">
                                    R$ {formatCurrency(analytics.largestExpense)}
                                </Typography>
                                <Typography variant="body2" color="warning.contrastText" sx={{ mt: 1 }}>
                                    Maior Despesa
                                </Typography>
                            </Box>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Box>
    );
}