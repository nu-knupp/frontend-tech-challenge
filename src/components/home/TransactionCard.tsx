import { Transaction } from "@/types/Transaction";
import { ListItem, Typography } from "@mui/material";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

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
        mb: 1,
        transition: "background-color 0.2s, padding 0.2s",
      }}
    >
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {format(parseISO(transaction.date), "MMMM", { locale: ptBR })}
      </Typography>
      <Typography variant="body1">
        {transaction.type == "credit" ? "Crédito" : "Débito"}{" "}
        <strong
          style={{ color: transaction.type == "credit" ? "green" : "red" }}
        >
          {transaction.type == "debit"
            ? `-R$ ${Math.abs(transaction.amount).toFixed(2)}`
            : `R$ ${transaction.amount.toFixed(2)}`}
        </strong>
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {format(parseISO(transaction.date), "dd/MM/yyyy")}
      </Typography>
      {transaction.observation && (
        <Typography variant="caption" sx={{ display: "block" }}>
          Obs: {transaction.observation}
        </Typography>
      )}
    </ListItem>
  );
}
