import { Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Alert,
  Box,
  Card,
  CardContent,
  IconButton,
  List,
  Menu,
  MenuItem,
  Snackbar,
  Typography,
} from "@mui/material";
import { Transaction } from "@/types/Transaction";
import { useTransactionStore } from "@/hooks/useTransactionStore";
import { useMemo, useState } from "react";
import TransactionCard from "./TransactionCard";
import TransactionEditor from "./TransactionEditor";
import DeleteTransactionDialog from "./DeleteTransactionDialog";

export default function RecentTransactions() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showTransactionEditor, setShowTransactionEditor] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const { transactions } = useTransactionStore();

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [transactions, sortOrder]);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setAnchorEl(null);
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
            </Box>
          </Box>

          <Box sx={{ maxHeight: 300, overflowY: "auto", mt: 2 }}>
            <List dense>
              {sortedTransactions.map((transaction, index) => {
                const isSelected = transaction.id === selectedTransaction?.id;
                return (
                  <TransactionCard
                    key={index}
                    isSelected={isSelected}
                    transaction={transaction}
                    handleSelect={() => setSelectedTransaction(transaction)}
                    handleDoubleClick={() => setShowTransactionEditor(true)}
                  />
                );
              })}
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
