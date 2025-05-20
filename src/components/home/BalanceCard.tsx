"use client";
import { Card, Typography, IconButton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "../../services/api";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  observation: string;
}

export default function BalanceCard() {
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState<number>(0);

  const today = format(new Date(), "EEEE',' dd/MM/yyyy", {
    locale: ptBR,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get<Transaction[]>("/transactions");

        // Filtra apenas os depósitos
        const deposits = response.data.filter(
          (transaction) => transaction.type === "Depósito"
        );

        // Soma os depósitos
        const totalDeposits = deposits.reduce(
          (acc, curr) => acc + curr.amount,
          0
        );

        setBalance(totalDeposits);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Card
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6">Olá, Joana! :)</Typography>
      <Typography variant="body2">{today}</Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Saldo
          </Typography>
          <Typography variant="h4">
            {showBalance ? `R$ ${balance.toFixed(2)}` : "****"}
          </Typography>
        </div>
        <IconButton
          sx={{ color: "primary.contrastText" }}
          onClick={() => setShowBalance(!showBalance)}
        >
          {showBalance ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </Stack>
    </Card>
  );
}
