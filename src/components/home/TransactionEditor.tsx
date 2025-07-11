import { useTransactionStore } from "@/hooks/useTransactionStore";
import { Transaction, TransactionType } from "@/types/Transaction";
import { formatValue, parseCurrencyString } from "@/utils/currency";
import { Delete } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { format, parseISO } from "date-fns";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 5,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { updateTransaction } = useTransactionStore();

  const hasntChangedSomeField =
    (parseFloat(formattedAmount.replace(/\./g, "").replace(",", ".")) ==
      transaction?.amount &&
      type == transaction?.type &&
      observation == transaction?.observation &&
      (transaction.file ? (fileBase64 == transaction.file) : fileBase64 == null)) ||
    parseCurrencyString(formattedAmount) == 0;

  useEffect(() => {
    if (transaction) {
      setObservation(transaction?.observation as string);
      setFormattedAmount(formatValue(transaction?.amount));
      setFileBase64(transaction.file || null);
      setFileName(transaction.fileName || null);
    }
  }, [transaction]);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const base64 = await fileToBase64(selected);
    setFileBase64(base64);
    setFileName(selected.name);
  };

  const handleRemoveFile = () => {
    setFileBase64(null);
    setFileName(null);
  };

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
      file: fileBase64 || '',
      fileName: fileName || '',
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

          {fileBase64 && fileName ? (
            <Box
              sx={{
                mt: 1,
                p: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                maxWidth: 350,
              }}
            >
              {fileBase64.startsWith("data:image/") ? (
                <Box
                  component="img"
                  src={fileBase64}
                  alt="Preview"
                  sx={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    borderRadius: 1,
                  }}
                >
                  📄
                </Box>
              )}
              <Typography variant="body2" title={fileName} noWrap>
                {fileName}
              </Typography>
              <IconButton size="small" color="error" onClick={handleRemoveFile}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{ p: 3 }}
            >
              upload de Arquivo
              <VisuallyHiddenInput
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                multiple={false}
              />
            </Button>
          )}
        </Stack>
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disabled={hasntChangedSomeField}
          sx={{ fontWeight: "bold", fontSize: "large", p: 1.5 }}
        >
          Salvar Alterações
        </Button>
      </Box>
    </Drawer>
  );
}
