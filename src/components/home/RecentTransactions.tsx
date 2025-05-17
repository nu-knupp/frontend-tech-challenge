"use client"
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  List,
  ListItem,
  Menu,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from "react";
import api from "../../services/api";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  observation?: string;
}

export default function RecentTransactions({ reload }: { reload: number }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formattedAmount, setFormattedAmount] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    loadTransactions();
  }, [reload, sortOrder]);

  const loadTransactions = useCallback(async () => {
    try {
      const res = await api.get<Transaction[]>("/transactions");
      const sorted = [...res.data].sort((a, b) =>
        sortOrder === "asc"
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date)
      );
      setTransactions(sorted);
      setSelectedId(null);
    } catch (error) {
      console.error("Erro ao carregar transações", error);
    }
  }, [sortOrder]);

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setAnchorEl(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/transactions/${id}`);
      await loadTransactions();
      setSnackbar({
        open: true,
        message: "Transação excluída com sucesso!",
      });
    } catch (error) {
      console.error(`Erro ao deletar transação com id ${id}`, error);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction({ ...transaction });
    setFormattedAmount(
      transaction.amount.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const handleSaveEdit = async () => {
    if (!editingTransaction) return;
    if (editingTransaction.amount === 0) {
      setError("Valor não pode ser zero.");
      return;
    }
    setError(null);
    try {
      await api.put(`/transactions/${editingTransaction.id}`, {
        ...editingTransaction,
        amount:
          editingTransaction.type === "Transferência"
            ? Math.abs(editingTransaction.amount) * -1
            : editingTransaction.amount,
      });
      setEditingTransaction(null);
      await loadTransactions();
      setSnackbar({
        open: true,
        message: "Transação editada com sucesso!",
      });
    } catch (error) {
      console.error(
        `Erro ao editar transação com id ${editingTransaction.id}`,
        error
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      !/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|,/.test(e.key) &&
      e.key.length === 1
    ) {
      e.preventDefault();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value === "") {
      setFormattedAmount("");
      setEditingTransaction((prev) => (prev ? { ...prev, amount: 0 } : prev));
      return;
    }
    const intValue = parseInt(value, 10);
    const formatted = (intValue / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setFormattedAmount(formatted);
    setEditingTransaction((prev) =>
      prev ? { ...prev, amount: intValue / 100 } : prev
    );
  };

  return (
    <>
      <Card sx={{ minWidth: 250 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Extrato</Typography>
            <Box>
              <IconButton
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  selected={sortOrder === "desc"}
                  onClick={() => handleSortChange("desc")}
                >
                  Mais recentes
                </MenuItem>
                <MenuItem
                  selected={sortOrder === "asc"}
                  onClick={() => handleSortChange("asc")}
                >
                  Mais antigas
                </MenuItem>
              </Menu>

              <IconButton
                size="small"
                disabled={!selectedId}
                onClick={() => {
                  const tx = transactions.find((t) => t.id === selectedId);
                  if (tx) handleEdit(tx);
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                disabled={!selectedId}
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ maxHeight: 300, overflowY: "auto", mt: 2 }}>
            <List dense>
              {transactions.map((tx) => {
                const isSelected = tx.id === selectedId;
                return (
                  <ListItem
                    key={tx.id}
                    onClick={() => setSelectedId(isSelected ? null : tx.id)}
                    onDoubleClick={() => handleEdit(tx)}
                    sx={{
                      display: "block",
                      px: 0,
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#f0f0f0" : "transparent",
                      borderRadius: 1,
                      mb: 1,
                      transition: "background-color 0.2s",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {format(parseISO(tx.date), "MMMM", { locale: ptBR })}
                    </Typography>
                    <Typography variant="body1">
                      {tx.type}{" "}
                      <strong
                        style={{ color: tx.amount < 0 ? "red" : "green" }}
                      >
                        {tx.amount < 0
                          ? `-R$ ${Math.abs(tx.amount).toFixed(2)}`
                          : `R$ ${tx.amount.toFixed(2)}`}
                      </strong>
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {format(parseISO(tx.date), "dd/MM/yyyy")}
                    </Typography>
                    {tx.observation && (
                      <Typography variant="caption" sx={{ display: "block" }}>
                        Obs: {tx.observation}
                      </Typography>
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja deletar esta transação? Esta ação não poderá
            ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              if (selectedId) handleDelete(selectedId);
              setDeleteDialogOpen(false);
            }}
            color="error"
            variant="contained"
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        anchor="right"
        open={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
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
                value={editingTransaction?.type || ""}
                onChange={(e) =>
                  setEditingTransaction((prev) =>
                    prev ? { ...prev, type: e.target.value } : prev
                  )
                }
              >
                <MenuItem value="Depósito">Depósito</MenuItem>
                <MenuItem value="Transferência">Transferência</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Valor"
              fullWidth
              value={formattedAmount}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              InputProps={{ startAdornment: <span>R$&nbsp;</span> }}
            />
            {error && <FormHelperText error>{error}</FormHelperText>}
            <TextField
              label="Data"
              value={
                editingTransaction
                  ? format(parseISO(editingTransaction.date), "dd/MM/yyyy")
                  : ""
              }
              disabled
              fullWidth
            />
            <TextField
              label="Observação (opcional)"
              value={editingTransaction?.observation || ""}
              onChange={(e) =>
                setEditingTransaction((prev) =>
                  prev ? { ...prev, observation: e.target.value } : prev
                )
              }
              fullWidth
              multiline
              rows={2}
            />
          </Stack>
          <Button variant="contained" fullWidth onClick={handleSaveEdit}>
            Salvar Alterações
          </Button>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
