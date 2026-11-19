import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { errorMessage } from '../../api/client';
import { useField } from '../../utils/useField';
import { validateName } from '../../utils/validation';
import { Alert } from '../Alert';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { Input } from '../Input';
import styles from './NameDialog.module.css';

interface NameDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  label: string;
  submitLabel: string;
  initialValue?: string;
  /** Пояснение над полем */
  description?: ReactNode;
  /** Сохранение. Ошибку API окно покажет само; закрывает окно вызывающий. */
  onSubmit: (name: string) => Promise<void>;
}

/** Диалог с одним полем названия: создание, переименование, форк. */
export function NameDialog({
  open,
  onClose,
  title,
  label,
  submitLabel,
  initialValue,
  description,
  onSubmit,
}: NameDialogProps) {
  const formId = useId();
  const [submitting, setSubmitting] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" form={formId} loading={submitting}>
            {submitLabel}
          </Button>
        </>
      }
    >
      {description && <p className={styles.description}>{description}</p>}
      <NameForm
        id={formId}
        label={label}
        initialValue={initialValue}
        onSubmit={onSubmit}
        onSubmittingChange={setSubmitting}
      />
    </Dialog>
  );
}

interface NameFormProps {
  id: string;
  label: string;
  initialValue?: string;
  onSubmit: (name: string) => Promise<void>;
  onSubmittingChange: (submitting: boolean) => void;
}

// Отдельный компонент, чтобы состояние поля сбрасывалось при каждом открытии.
function NameForm({ id, label, initialValue = '', onSubmit, onSubmittingChange }: NameFormProps) {
  const name = useField(validateName, initialValue);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    if (!name.check()) {
      name.focus();
      return;
    }
    onSubmittingChange(true);
    try {
      await onSubmit(name.value.trim());
    } catch (error) {
      setFormError(errorMessage(error));
    } finally {
      onSubmittingChange(false);
    }
  };

  return (
    <form id={id} className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError && <Alert>{formError}</Alert>}
      <Input label={label} name="name" autoComplete="off" required data-autofocus {...name.inputProps} />
    </form>
  );
}
