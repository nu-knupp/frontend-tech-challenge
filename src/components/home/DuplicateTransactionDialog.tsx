import {useTransactionStore} from "@/hooks/useTransactionStore";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, Typography,
} from "@mui/material";

interface DuplicateTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DuplicateTransactionDialog(
  {
    open,
    onClose,
    onConfirm,
  }: DuplicateTransactionDialogProps) {

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Transação duplicada</DialogTitle>
      <DialogContent>
        <Typography>
          Já existe uma transação com o mesmo tipo, valor e categoria neste dia.
        </Typography>
        <Typography>
          <b>Deseja salvar mesmo assim?</b>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Salvar Mesmo Assim
        </Button>
      </DialogActions>
    </Dialog>
  );
}
