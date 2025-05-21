import { useTransactionStore } from "@/hooks/useTransactionStore";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface DeleteTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  selectedId: string;
}

export default function DeleteTransactionDialog({
  open,
  onClose,
  selectedId,
}: DeleteTransactionDialogProps) {
  const { deleteTransaction } = useTransactionStore();
  const handleDelete = () => {
    deleteTransaction(selectedId).then(onClose);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar exclusão</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Tem certeza que deseja deletar esta transação? Esta ação não poderá
          ser desfeita.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Deletar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
