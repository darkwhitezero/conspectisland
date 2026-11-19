import { useId, useState, type FormEvent } from 'react';
import { errorMessage, isApiError } from '../../../api/client';
import { useAuth } from '../../../app/AuthProvider';
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';
import { Dialog } from '../../../components/Dialog';
import { Input } from '../../../components/Input';
import { useField } from '../../../utils/useField';
import styles from './DeleteAccountDialog.module.css';

const requirePassword = (value: string) => (value ? null : 'Введите пароль');

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

/** Подтверждение удаления учётной записи с повторным вводом пароля. */
export function DeleteAccountDialog({ open, onClose }: DeleteAccountDialogProps) {
  const formId = useId();
  const [submitting, setSubmitting] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Удалить учётную запись?"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" form={formId} variant="danger" loading={submitting}>
            Удалить учётную запись
          </Button>
        </>
      }
    >
      <DeleteAccountForm id={formId} onSubmittingChange={setSubmitting} />
    </Dialog>
  );
}

function DeleteAccountForm({ id, onSubmittingChange }: { id: string; onSubmittingChange: (busy: boolean) => void }) {
  const { deleteAccount } = useAuth();
  const password = useField(requirePassword);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    if (!password.check()) {
      password.focus();
      return;
    }
    onSubmittingChange(true);
    try {
      // После удаления сессии нет — RequireAuth сам уведёт на страницу входа.
      await deleteAccount(password.value);
    } catch (error) {
      if (isApiError(error) && error.code === 'invalid_password') {
        password.setError(error.message);
        password.focus();
      } else {
        setFormError(errorMessage(error));
      }
      onSubmittingChange(false);
    }
  };

  return (
    <form id={id} className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError && <Alert>{formError}</Alert>}
      <p>
        Будут удалены все проекты, где вы — владелец, вместе с их конспектами и файлами. Из остальных проектов вы
        выйдете. Отменить это действие нельзя.
      </p>
      <Input
        label="Пароль"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        data-autofocus
        {...password.inputProps}
      />
    </form>
  );
}
