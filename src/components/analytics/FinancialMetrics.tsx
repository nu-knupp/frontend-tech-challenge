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
import { FinancialAnalytics } from '@/hooks/useFinancialAnalytics';

interface FinancialMetricsProps {
    analytics: FinancialAnalytics;
}

export default function FinancialMetrics({ analytics }: FinancialMetricsProps) {
    const formatCurrency = (value: number) =>
        `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    const formatPercentage = (value: number) =>
        `${value.toFixed(1)}%`;

    return (
        <Grid container spacing={2}
            justifyContent="center">
            <Grid sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Card
                    sx={{
                        width: { xs: '100%', md: 'auto' },
                        mb: 1,
                        pb: 0
                    }}
                >
                    <CardContent
                        sx={{
                            pb: 2,
                            mb: 0,
                            px: { xs: 2, md: 1 },
                            py: { xs: 2, md: 1 }
                        }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mb={2}>
                            <TrendingUp color="success" sx={{ mr: 1 }} />
                            <Typography variant="h6">Crescimento de Receitas</Typography>
                        </Box>
                        <Typography
                            variant="h5"
                            color={analytics.incomeGrowth >= 0 ? 'success.main' : 'error.main'}>
                            {formatPercentage(analytics.incomeGrowth)}
                        </Typography>
                        <Chip
                            label={analytics.incomeGrowth >= 0 ? "Crescimento" : "Declínio"}
                            color={analytics.incomeGrowth >= 0 ? "success" : "error"}
                            size="small"
                            sx={{ mt: 1, width: { xs: '60%', md: '100%' } }}
                        />
                    </CardContent>
                </Card>
            </Grid>

            <Grid sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Card
                    sx={{
                        width: { xs: '100%', md: 'auto' },
                        mb: 1,
                        pb: 0
                    }}
                >
                    <CardContent
                        sx={{
                            pb: 2,
                            mb: 0,
                            px: { xs: 2, md: 1 },
                            py: { xs: 2, md: 1 }
                        }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mb={2}>
                            <TrendingDown
                                color="error" sx={{ mr: 1 }} />
                            <Typography variant="h6">
                                Crescimento de Despesas
                            </Typography>
                        </Box>
                        <Typography
                            variant="h5"
                            color={analytics.expenseGrowth <= 0 ? 'success.main' : 'error.main'}>
                            {formatPercentage(analytics.expenseGrowth)}
                        </Typography>
                        <Chip
                            label={analytics.expenseGrowth <= 0 ? "Controle" : "Aumento"}
                            color={analytics.expenseGrowth <= 0 ? "success" : "warning"}
                            size="small"
                            sx={{ mt: 1, width: { xs: '60%', md: '100%' } }}
                        />
                    </CardContent>
                </Card>
            </Grid>

            <Grid sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Card
                    sx={{
                        width: { xs: '100%', md: 'auto' },
                        mb: 1,
                        pb: 0
                    }}
                >
                    <CardContent
                        sx={{
                            pb: 2,
                            mb: 0,
                            px: { xs: 2, md: 1 },
                            py: { xs: 2, md: 1 }
                        }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mb={2}>
                            <Savings
                                color="primary"
                                sx={{ mr: 1 }} />
                            <Typography variant="h6">
                                Taxa de Poupança
                            </Typography>
                        </Box>
                        <Typography
                            variant="h5"
                            color={analytics.savingsRate >= 0 ? 'success.main' : 'error.main'}>
                            {formatPercentage(analytics.savingsRate)}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min(Math.abs(analytics.savingsRate), 100)}
                            color={analytics.savingsRate >= 0 ? "success" : "error"}
                            sx={{ mt: 2, height: 8, borderRadius: 4 }}
                        />
                    </CardContent>
                </Card>
            </Grid>

            <Grid sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Card
                    sx={{
                        width: { xs: '100%', md: 'auto' },
                        mb: 1,
                        pb: 0
                    }}
                >
                    <CardContent
                        sx={{
                            pb: 2,
                            mb: 0,
                            px: { xs: 2, md: 1 },
                            py: { xs: 2, md: 1 }
                        }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mb={2}>
                            <CalendarToday
                                color="info"
                                sx={{ mr: 1 }} />
                            <Typography variant="h6">
                                Dia Mais Ativo
                            </Typography>
                        </Box>
                        <Typography
                            variant="h5"
                            color="primary.main">
                            {analytics.mostActiveDay || 'N/A'}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}>
                            Maior volume de transações
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Card
                    sx={{
                        width: { xs: '100%', md: 'auto' },
                        mb: 1,
                        pb: 0
                    }}
                >
                    <CardContent
                        sx={{
                            pb: 2,
                            mb: 0,
                            px: { xs: 2, md: 1 },
                            py: { xs: 2, md: 1 }
                        }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mb={2}>
                            <AccountBalanceWallet
                                color="success"
                                sx={{ mr: 1 }} />
                            <Typography variant="h6">
                                Maior Receita
                            </Typography>
                        </Box>
                        <Typography
                            variant="h5"
                            color="success.main">
                            {formatCurrency(analytics.largestIncome)}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}>
                            Transação individual de maior valor
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Card
                    sx={{
                        width: { xs: '100%', md: 'auto' },
                        mb: 1,
                        pb: 0
                    }}
                >
                    <CardContent
                        sx={{
                            pb: 2,
                            mb: 0,
                            px: { xs: 2, md: 1 },
                            py: { xs: 2, md: 1 }
                        }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mb={2}>
                            <AccountBalanceWallet
                                color="error"
                                sx={{ mr: 1 }} />
                            <Typography variant="h6">
                                Maior Despesa
                            </Typography>
                        </Box>
                        <Typography
                            variant="h5"
                            color="error.main">
                            {formatCurrency(analytics.largestExpense)}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}>
                            Gasto individual de maior valor
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}