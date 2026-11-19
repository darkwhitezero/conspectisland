import { useState, type ReactNode } from 'react';
import { errorMessage } from '../../api/client';
import { Alert } from '../Alert';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  /** Необратимые действия выделяются красным */
  danger?: boolean;
  /** Действие. Ошибку окно покажет само; закрывает окно вызывающий. */
  onConfirm: () => Promise<void>;
}

/** Подтверждение перед необратимым действием (domain.md, раздел 5). */
export function ConfirmDialog({ open, onClose, title, children, confirmLabel, danger = false, onConfirm }: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} data-autofocus>
            Отмена
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} loading={busy} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        {error && <Alert>{error}</Alert>}
        <div className={styles.message}>{children}</div>
      </div>
    </Dialog>
  );
}
