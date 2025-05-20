"use client";
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormHelperText,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import api from "../../services/api";

export default function NewTransactionForm({ onAdd }: { onAdd: () => void }) {
  const [type, setType] = useState("Depósito");
  const [formattedAmount, setFormattedAmount] = useState<string>("");
  const [observation, setObservation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      !/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|,/.test(e.key) &&
      e.key.length === 1
    ) {
      e.preventDefault();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value === "") {
      setFormattedAmount("");
      return;
    }

    const intValue = parseInt(value, 10);
    const formatted = (intValue / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setFormattedAmount(formatted);
  };

  const handleSubmit = async () => {
    const numericValue = parseFloat(
      formattedAmount.replace(/\./g, "").replace(",", ".")
    );

    if (isNaN(numericValue) || numericValue === 0) {
      setError("Valor não pode ser zero.");
      return;
    }

    setError(null);

    const transaction = {
      type,
      amount: type === "Depósito" ? numericValue : -numericValue,
      date: new Date().toISOString(),
      observation,
    };

    try {
      await api.post("/transactions", transaction);

      setFormattedAmount("");
      setObservation("");
      setSnackbar({ open: true, message: "Transação adicionada com sucesso!" });
      onAdd();
    } catch (error) {
      console.error("Erro ao adicionar transação", error);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Nova transação</Typography>

        <TextField
          select
          label="Tipo de transação"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="Depósito">Depósito</MenuItem>
          <MenuItem value="Transferência">Transferência</MenuItem>
        </TextField>

        <TextField
          label="Valor"
          value={formattedAmount}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          InputProps={{ startAdornment: <span>R$&nbsp;</span> }}
          placeholder="0,00"
          fullWidth
        />
        {error && <FormHelperText error>{error}</FormHelperText>}

        <TextField
          label="Observação"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          multiline
          rows={2}
          // placeholder="Adicione uma observação (opcional)"
        />

        <Button sx={{p: 2, fontSize: 'large'}} variant="contained" onClick={handleSubmit}>
          Concluir transação
        </Button>
      </CardContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
