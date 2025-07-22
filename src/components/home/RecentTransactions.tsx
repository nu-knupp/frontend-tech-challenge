import { useTransactionStore } from "@/hooks/useTransactionStore";
import { Transaction } from "@/types/Transaction";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  IconButton,
  List,
  Menu,
  MenuItem,
  Snackbar,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import DeleteTransactionDialog from "./DeleteTransactionDialog";
import TransactionCard from "./TransactionCard";
import TransactionEditor from "./TransactionEditor";

export default function RecentTransactions() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showTransactionEditor, setShowTransactionEditor] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<"all" | "credit" | "debit">("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = Boolean(anchorEl);

  const {
    transactions,
    fetchTransactions,
    fetchNextPage,
    page,
    totalPages,
    loading,
  } = useTransactionStore();

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const type = transactionTypeFilter === "all" ? undefined : transactionTypeFilter;
    fetchTransactions(1, "date", sortOrder, type);
  }, [sortOrder, transactionTypeFilter]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && page < totalPages && !loading) {
          const type = transactionTypeFilter === "all" ? undefined : transactionTypeFilter;
          await fetchNextPage("date", sortOrder, type);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [page, totalPages, loading, sortOrder, transactionTypeFilter]);

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setAnchorEl(null);
  };

  return (
    <>
      <Card sx={{ minWidth: 250, py: { xs: 0, sm: 1 }, px: { xs: 0, sm: 1 } }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ pl: ".5rem" }}>Extrato</Typography>
            <Box>
              <IconButton
                size="small"
                disabled={!selectedTransaction}
                onClick={() => setShowTransactionEditor(true)}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                disabled={!selectedTransaction}
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Delete fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu anchorEl={anchorEl} open={openMenu} onClose={() => setAnchorEl(null)}>
                <MenuItem selected={sortOrder === "desc"} onClick={() => handleSortChange("desc")}>
                  Mais recentes
                </MenuItem>
                <MenuItem selected={sortOrder === "asc"} onClick={() => handleSortChange("asc")}>
                  Mais antigas
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Filtro por tipo */}
          <Box mt={2} display="flex" justifyContent="center">
            <ButtonGroup variant="outlined" size="small">
              <>
              {["all", "credit", "debit"].map((type, index) => (
                <Button
                  key={index}
                  variant={transactionTypeFilter === type ? "contained" : "outlined"}
                  onClick={() => setTransactionTypeFilter(type as typeof transactionTypeFilter)}
                >
                  {type === "all" ? "Todos" : type === "credit" ? "Crédito" : "Débito"}
                </Button>
              ))}
              </>
            </ButtonGroup>
          </Box>

          {/* Lista de transações */}
          <Box sx={{ maxHeight: 300, overflowY: "auto", mt: 2 }}>
            <List dense>
              <>
              {transactions.map((transaction, index) => {
                const isSelected = transaction.id === selectedTransaction?.id;
                return (
                  <TransactionCard
                    key={transaction.id}
                    isSelected={isSelected}
                    transaction={transaction}
                    handleSelect={() => setSelectedTransaction(transaction)}
                    handleDoubleClick={() => setShowTransactionEditor(true)}
                  />
                );
              })}
              </>
              <>{page < totalPages && <div ref={sentinelRef} style={{ height: 1 }} />}</>
            </List>
          </Box>
        </CardContent>
      </Card>

      {showTransactionEditor && (
        <TransactionEditor
          transaction={selectedTransaction}
          open={showTransactionEditor}
          onClose={() => setShowTransactionEditor(false)}
        />
      )}

      {deleteDialogOpen && (
        <DeleteTransactionDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          selectedId={selectedTransaction?.id as string}
        />
      )}

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
