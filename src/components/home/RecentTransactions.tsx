import { useTransactionStore } from "@/hooks/useTransactionStore";
import { Transaction } from "@/types/Transaction";
import { Delete, Edit, FilterList, MoreVert } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Checkbox,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
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

  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openMenu = Boolean(anchorEl);

  const availableCategories = [
    "Alimentação",
    "Transporte",
    "Saúde",
    "Educação",
    "Lazer",
    "Moradia",
    "Pagamento",
    "Wellness",
    "Outros"
  ];

  const {
    transactions,
    fetchTransactions,
    fetchNextPage,
    page,
    totalPages,
    loading,
  } = useTransactionStore();

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const applyFilters = () => {
    const type = transactionTypeFilter === "all" ? undefined : transactionTypeFilter;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setDateError(true);
      return;
    }

    setDateError(false);
    fetchTransactions(
      1,
      "date",
      sortOrder,
      type,
      categoryFilter,
      searchQuery,
      startDate,
      endDate
    );
    setDrawerOpen(false);
  };

  useEffect(() => {
    const type = transactionTypeFilter === "all" ? undefined : transactionTypeFilter;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setDateError(true);
      return;
    }

    setDateError(false);
    fetchTransactions(
      1,
      "date",
      sortOrder,
      type,
      categoryFilter,
      searchQuery,
      startDate,
      endDate
    );
  }, [sortOrder, transactionTypeFilter, categoryFilter, searchQuery, startDate, endDate]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && page < totalPages && !loading) {
          const type = transactionTypeFilter === "all" ? undefined : transactionTypeFilter;
          if (startDate && endDate && new Date(startDate) > new Date(endDate)) return;

          await fetchNextPage(
            "date",
            sortOrder,
            type,
            categoryFilter,
            searchQuery,
            startDate,
            endDate
          );
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [page, totalPages, loading, sortOrder, transactionTypeFilter, categoryFilter, searchQuery, startDate, endDate]);

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setAnchorEl(null);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];

    if (value.includes("Outros")) {
      setCategoryFilter(["Outros"]);
    } else {
      setCategoryFilter(value.filter((cat) => cat !== "Outros"));
    }
  };

  return (
    <>
      <Card sx={{ minWidth: 250, py: { xs: 0, sm: 1 }, px: { xs: 0, sm: 1 } }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ pl: ".5rem" }}>Extrato</Typography>
            <Box>
              <IconButton size="small" onClick={() => setDrawerOpen(true)}>
                <FilterList fontSize="small" />
              </IconButton>
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
                <MenuItem selected={sortOrder === "desc"} onClick={() => handleSortChange("desc")}>Mais recentes</MenuItem>
                <MenuItem selected={sortOrder === "asc"} onClick={() => handleSortChange("asc")}>Mais antigas</MenuItem>
              </Menu>
            </Box>
          </Box>

          <Box mt={2} display="flex" justifyContent="center">
            <ButtonGroup variant="outlined" size="small">
              {["all", "credit", "debit"].map((type) => (
                <Button
                  key={type}
                  variant={transactionTypeFilter === type ? "contained" : "outlined"}
                  onClick={() => setTransactionTypeFilter(type as typeof transactionTypeFilter)}
                >
                  {type === "all" ? "Todos" : type === "credit" ? "Crédito" : "Débito"}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          <Box sx={{ maxHeight: 300, overflowY: "auto", mt: 2 }}>
            <List dense>
              {transactions.map((transaction) => {
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
              {page < totalPages && <div ref={sentinelRef} style={{ height: 1 }} />}
            </List>
          </Box>
        </CardContent>
      </Card>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{
          mt: "64px",
          height: "calc(100% - 64px)",
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          width: 400,
          p: 4
        }}
          role="presentation"
        >
          <Typography variant="h6" gutterBottom>Filtros</Typography>

          <TextField
            fullWidth
            size="small"
            label="Buscar por categoria ou observação"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl size="small" fullWidth sx={{ mb: 2 }}>
            <InputLabel id="category-filter-label">Categorias</InputLabel>
            <Select
              labelId="category-filter-label"
              multiple
              value={categoryFilter}
              onChange={handleCategoryChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {availableCategories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  <Checkbox checked={categoryFilter.indexOf(cat) > -1} />
                  <ListItemText primary={cat} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" gap={1} mb={2}>
            <TextField
              type="date"
              size="small"
              label="Início"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
            />
            <TextField
              type="date"
              size="small"
              label="Fim"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
            />
          </Box>

          {dateError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              A data inicial não pode ser maior que a data final.
            </Alert>
          )}

          <Button variant="contained" fullWidth onClick={applyFilters}>
            Aplicar filtros
          </Button>
        </Box>
      </Drawer>

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
