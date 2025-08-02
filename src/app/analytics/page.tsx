"use client";
import React, { useEffect } from "react";
import {
    Box,
    Grid,
    Card,
    Typography,
    CardContent,
    Paper,
    Chip,
    Stack,
} from "@mui/material";
import {
    TrendingUp,
    TrendingDown,
    AccountBalance,
    Assessment,
} from "@mui/icons-material";
import LayoutContainer from "@/components/layout/Layout";
import { useTransactionStore } from "@/hooks/useTransactionStore";
import { useFinancialAnalytics } from "@/hooks/useFinancialAnalytics";
import MonthlyTrendChart from "@/components/analytics/MonthlyTrendChart";
import CategoryChart from "@/components/analytics/CategoryChart";
import CashFlowChart from "@/components/analytics/CashFlowChart";
import FinancialMetrics from "@/components/analytics/FinancialMetrics";

export default function AnalyticsPage() {
    const { transactions, fetchTransactions, balance } = useTransactionStore();
    const analytics = useFinancialAnalytics(transactions);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return (
        <LayoutContainer>
            <Box sx={{ mb: 2, p: 3, textAlign: "center", }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        color: "primary.main",
                        mb: 1
                    }}>
                    NÃO É ESTE
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Visão detalhada do seu desempenho financeiro
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 3,
                    p: 3,
                    maxWidth: "1400px",
                    margin: "0 auto",
                    width: "100%"
                }}>
                <Grid container spacing={3}>
                    <Card
                        sx={{
                            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                            color: "white",
                            width: {
                                xs: '100%',
                                sm: 'auto',
                            }
                        }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Saldo Atual
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        R$ {balance}
                                    </Typography>
                                </Box>
                                <AccountBalance sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card
                        sx={{
                            background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
                            color: "white",
                            width: {
                                xs: '100%',
                                sm: 'auto',
                            }
                        }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Total Receitas
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        R$ {analytics.totalIncome.toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </Typography>
                                </Box>
                                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card
                        sx={{
                            background: "linear-gradient(135deg, #d32f2f 0%, #c62828 100%)",
                            color: "white",
                            width: {
                                xs: '100%',
                                sm: 'auto',
                            }
                        }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Total Despesas
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        R$ {analytics.totalExpenses.toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </Typography>
                                </Box>
                                <TrendingDown sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card
                        sx={{
                            background: analytics.netFlow >= 0
                                ? "linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)"
                                : "linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)",
                            color: "white",
                            width: {
                                xs: '100%',
                                sm: 'auto',
                            }
                        }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Fluxo Líquido
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        R$ {analytics.netFlow.toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </Typography>
                                    <Chip
                                        label={analytics.netFlow >= 0 ? "Positivo" : "Negativo"}
                                        size="small"
                                        sx={{
                                            mt: 1,
                                            bgcolor: "rgba(255,255,255,0.2)",
                                            color: "white",
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Métricas Financeiras */}
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: '100%', maxWidth: 998 }}>
                        <FinancialMetrics analytics={analytics} />
                    </Box>
                </Box>

                {/* Gráficos */}
                <Grid container spacing={3} width={'100%'}>
                    {/* Gráfico de Tendência Mensal */}
                    <Grid size={{ md: 4 }}>
                        <Paper sx={{ p: 3, height: "420px" }}>
                            <Typography variant="h6" gutterBottom>
                                Tendência Mensal
                            </Typography>
                            <MonthlyTrendChart data={analytics.monthlyTrends} />
                        </Paper>
                    </Grid>

                    {/* Gráfico de Categorias */}
                    <Grid size={{ md: 4 }}>

                        <Paper sx={{ p: 3, height: "420px" }}>
                            <Typography variant="h6" gutterBottom>
                                Análise por Tipo
                            </Typography>
                            <CategoryChart
                                income={analytics.totalIncome}
                                expenses={analytics.totalExpenses}
                            />
                        </Paper>
                    </Grid>

                    {/* Gráfico de Fluxo de Caixa */}

                    <Grid size={{ md: 4 }}>
                        <Paper sx={{ p: 3, height: "420px" }}>
                            <Typography variant="h6" gutterBottom>
                                Fluxo de Caixa Diário
                            </Typography>
                            <CashFlowChart data={analytics.dailyCashFlow} />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </LayoutContainer>
    );
}