import { Transaction } from "@/types/Transaction";
import { Box, IconButton, ListItem, Typography } from "@mui/material";
import { formatValue } from "@/utils/currency";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

interface TransactionCardProps {
  isSelected: boolean;
  transaction: Transaction;
  handleSelect: () => void;
  handleDoubleClick: () => void;
}

export default function TransactionCard({
  transaction,
  isSelected,
  handleSelect,
  handleDoubleClick,
}: TransactionCardProps) {
  return (
    <ListItem
      key={transaction.id}
      onClick={handleSelect}
      onDoubleClick={handleDoubleClick}
      sx={{
        display: "block",
        px: isSelected ? 2 : 1,
        py: isSelected ? 2 : 1,
        cursor: "pointer",
        backgroundColor: isSelected ? "#f0f0f0" : "transparent",
        borderRadius: 1,
        mb: { xs: 0, md: 0.5 },
        transition: "background-color 0.2s, padding 0.2s",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {format(parseISO(transaction.date), "MMMM", { locale: ptBR })}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {format(parseISO(transaction.date), "dd/MM/yyyy")}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">
          {transaction.type === "credit" ? "Crédito" : "Débito"}{" "}
          <strong
            style={{ color: transaction.type === "credit" ? "green" : "red" }}
          >
            {transaction.type === "debit"
              ? `- ${formatValue(transaction.amount)}`
              : formatValue(transaction.amount)}
          </strong>
        </Typography>

        {transaction.file && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              const link = document.createElement("a");
              link.href = transaction.file ?? "";
              link.download = transaction.fileName || "arquivo";
              link.click();
            }}
          >
            <SaveAltIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </IconButton>
        )}
      </Box>
      {transaction.observation && (
        <Typography variant="caption" sx={{ display: "block" }}>
          Obs: {transaction.observation}
        </Typography>
      )}
    </ListItem>
  );
}
