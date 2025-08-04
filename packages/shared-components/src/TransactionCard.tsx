import { Transaction } from "@banking/shared-types";
import { Box, Chip, IconButton, ListItem, Typography } from "@mui/material";
import { formatValue } from "@banking/shared-utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

interface TransactionCardProps {
  isSelected?: boolean;
  transaction: Transaction;
  onSelect?: () => void;
  onDoubleClick?: () => void;
  showFile?: boolean;
}

export default function TransactionCard({
  transaction,
  isSelected = false,
  onSelect,
  onDoubleClick,
  showFile = true,
}: TransactionCardProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (transaction.file && transaction.fileName) {
      const link = document.createElement("a");
      link.href = transaction.file;
      link.download = transaction.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <ListItem
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      sx={{
        display: "block",
        px: isSelected ? 2 : 1,
        py: isSelected ? 2 : 1,
        cursor: onSelect ? "pointer" : "default",
        backgroundColor: isSelected ? "#f0f0f0" : "transparent",
        border: isSelected ? "1px solid #ccc" : "none",
        borderRadius: 1,
        mb: 1,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "#f8f8f8",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.75rem" }}
        >
          {format(parseISO(transaction.date), "dd/MM/yyyy - HH:mm", {
            locale: ptBR,
          })}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: transaction.type === "credit" ? "success.main" : "error.main",
            fontWeight: "bold",
          }}
        >
          {transaction.type === "credit" ? "+" : "-"}R$ {formatValue(transaction.amount)}
        </Typography>
      </Box>

      {transaction.observation && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          {transaction.observation}
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", flex: 1 }}>
          {transaction.categories?.map((categoria: string) => (
            <Chip
              key={categoria}
              label={categoria}
              size="small"
              sx={{
                fontSize: "0.6rem",
                height: 20,
                textTransform: "capitalize",
              }}
            />
          ))}
        </Box>

        {showFile && transaction.file && (
          <IconButton
            size="small"
            onClick={handleDownload}
            sx={{ ml: 1 }}
            title={`Baixar ${transaction.fileName || "arquivo"}`}
          >
            <SaveAltIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </ListItem>
  );
}
