import { Transaction } from '@/types/Transaction';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    LinearProgress,
} from '@mui/material';
import {
    TrendingUp,
    Assessment,
    CalendarToday,
} from '@mui/icons-material';

interface FinancialSummaryProps {
    transactions: Transaction[];
}

export default function FinancialSummary({ transactions }: FinancialSummaryProps) {
    if (!transactions.length) {
        return (
            <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Adicione suas primeiras transações para ver as análises
                </Typography>
            </Card>
        );
    }

    const income = transactions.filter((t) => t.type === "credit");
    const expense = transactions.filter((t) => t.type === "debit");

    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expense.reduce((sum, t) => sum + t.amount, 0);
    const netFlow = totalIncome - totalExpenses;
    const savingsRate = totalIncome ? (netFlow / totalIncome) * 100 : 0;

    const dates = transactions.map((t) => t.date.split("T")[0]);
    const dateCounts = dates.reduce<Record<string, number>>((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    const mostActiveDay = Object.entries(dateCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const formatCurrency = (value: number) =>
        value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center", color: "primary.main" }}>
                Resumo Financeiro
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                <Card>
                    <CardContent sx={{ textAlign: "center" }}>
                        <Assessment color={netFlow >= 0 ? "success" : "error"} />
                        <Typography variant="subtitle1">Fluxo Líquido</Typography>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            color={netFlow >= 0 ? "success.main" : "error.main"}
                        >
                            R$ {formatCurrency(netFlow)}
                        </Typography>
                        <Chip
                            label={netFlow >= 0 ? "Positivo" : "Negativo"}
                            color={netFlow >= 0 ? "success" : "error"}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent sx={{ textAlign: "center" }}>
                        <TrendingUp color="primary" />
                        <Typography variant="subtitle1">Taxa de Poupança</Typography>
                        <Typography variant="h5">{formatPercentage(savingsRate)}</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min(Math.abs(savingsRate), 100)}
                            color={savingsRate >= 0 ? "success" : "error"}
                            sx={{ mt: 1 }}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent sx={{ textAlign: "center" }}>
                        <CalendarToday color="info" />
                        <Typography variant="subtitle1">Dia Mais Ativo</Typography>
                        <Typography variant="h5">{mostActiveDay || "N/A"}</Typography>
                        <Typography variant="body2">{transactions.length} transações</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Box>
    );
}
