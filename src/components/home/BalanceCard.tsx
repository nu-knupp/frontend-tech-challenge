import { Card, Typography, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTransactionStore } from "@/hooks/useTransactionStore";

export default function BalanceCard() {
  const [showBalance, setShowBalance] = useState(true);

  const { balance } = useTransactionStore();

  const today = format(new Date(), "EEEE',' dd/MM/yyyy", {
    locale: ptBR,
  });

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
            {showBalance ? `R$ ${balance}` : "****"}
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
