import { useTransactionStore } from "@/hooks/useTransactionStore";
import { Transaction, TransactionType } from "@/types/Transaction";
import { formatValue } from "@/utils/currency";
import { Delete } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

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

export default function NewTransactionForm() {
  const [type, setType] = useState<TransactionType>();
  const [formattedAmount, setFormattedAmount] = useState<string>("");
  const [observation, setObservation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    console.log("Arquivo selecionado:", selectedFile);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const { createTransaction } = useTransactionStore();

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

    setFormattedAmount(formatValue(value));
  };

  const handleSubmit = async () => {
    const numericValue = parseFloat(
      formattedAmount.replace(/\./g, "").replace(",", ".")
    );

    if (isNaN(numericValue) || numericValue === 0) {
      setError("Valor não pode ser zero.");
      return;
    }

    if (!type) {
      setError("Selecione o tipo de transação.");
      return;
    }

    setError(null);

    let base64File = "";
    if (file) {
      try {
        base64File = await fileToBase64(file);
      } catch (err) {
        console.error("Erro ao converter arquivo para base64:", err);
        return;
      }
    }

    const transaction: Omit<Transaction, "id"> = {
      type,
      amount: numericValue,
      date: new Date().toISOString(),
      observation,
      file: base64File,
      fileName: file?.name || "",
    };

    try {
      createTransaction(transaction);
      setFormattedAmount("");
      setObservation("");
      setFile(null);
      setSnackbar({ open: true, message: "Transação adicionada com sucesso!" });
    } catch (error) {
      console.error("Erro ao adicionar transação", error);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card sx={{ px: { xs: 0, sm: "1rem" }, py: 0 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Nova transação</Typography>

        <TextField
          select
          label="Tipo de transação"
          value={type ?? ""}
          onChange={(e) => setType(e.target.value as TransactionType)}
        >
          <MenuItem value="credit">Depósito</MenuItem>
          <MenuItem value="debit">Transferência</MenuItem>
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
        />

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
        {file && (
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
            {file.type.startsWith("image/") ? (
              <Box
                component="img"
                src={URL.createObjectURL(file)}
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
            <Typography variant="body2" title={file.name} noWrap>
              {file.name}
            </Typography>
            <IconButton size="small" color="error" onClick={handleRemoveFile}>
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Button
          sx={{ p: 2, fontSize: "large", fontWeight: "bold" }}
          variant="contained"
          onClick={handleSubmit}
        >
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
