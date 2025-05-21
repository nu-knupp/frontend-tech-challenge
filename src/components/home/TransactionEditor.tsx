import { useTransactionStore } from "@/hooks/useTransactionStore";
import { Transaction, TransactionType } from "@/types/Transaction";
import { formatValue, parseCurrencyString } from "@/utils/currency";
import {
  Box,
  Button,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

interface TransactionEditorProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function TransactionEditor({
  transaction,
  open,
  onClose,
}: TransactionEditorProps) {
  const [formattedAmount, setFormattedAmount] = useState("");
  const [type, setType] = useState<TransactionType>(
    transaction?.type as TransactionType
  );
  const [observation, setObservation] = useState("");

  const { updateTransaction } = useTransactionStore();

  const hasntChangedSomeField =
    (parseFloat(formattedAmount.replace(/\./g, "").replace(",", ".")) ==
      transaction?.amount &&
      type == transaction?.type &&
      observation == transaction?.observation) ||
    parseCurrencyString(formattedAmount) == 0;

  useEffect(() => {
    if (transaction) {
      setObservation(transaction?.observation as string);
      setFormattedAmount(formatValue(transaction?.amount));
    }
  }, [transaction]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value === "") {
      setFormattedAmount("");
      return;
    }

    setFormattedAmount(formatValue(value));
  };

  const handleSubmit = () => {
    const fieldsToUpdate = {
      type,
      amount: parseCurrencyString(formattedAmount),
      observation,
    };

    updateTransaction(
      transaction?.id as string,
      transaction as Transaction,
      fieldsToUpdate
    ).then(onClose);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      !/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|,/.test(e.key) &&
      e.key.length === 1
    ) {
      e.preventDefault();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          mt: "64px",
          height: "calc(100% - 64px)",
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Typography variant="h6" mb={2}>
          Editar Transação
        </Typography>
        <Stack spacing={2} flex={1}>
          <FormControl fullWidth>
            <InputLabel id="type-label">Tipo</InputLabel>
            <Select
              labelId="type-label"
              label="Tipo"
              value={type || transaction?.type}
              onChange={(e) => setType(e.target.value as TransactionType)}
            >
              <MenuItem value="credit">Depósito</MenuItem>
              <MenuItem value="debit">Transferência</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Valor"
            fullWidth
            value={formattedAmount || transaction?.amount}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            InputProps={{ startAdornment: <span>R$&nbsp;</span> }}
          />

          <TextField
            label="Data"
            value={
              transaction
                ? format(parseISO(transaction.date), "dd/MM/yyyy")
                : ""
            }
            disabled
            fullWidth
          />
          <TextField
            label="Observação (opcional)"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
        </Stack>
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disabled={hasntChangedSomeField}
        >
          Salvar Alterações
        </Button>
      </Box>
    </Drawer>
  );
}
