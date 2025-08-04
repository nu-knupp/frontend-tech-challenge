import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTransactionStore } from "@banking/shared-hooks";

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
      <DialogTitle sx={{ textAlign: "center" }}>Confirmar Exclusão</DialogTitle>
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
