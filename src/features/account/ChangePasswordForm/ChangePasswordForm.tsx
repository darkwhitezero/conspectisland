import { useState, type FormEvent } from 'react';
import { changePassword } from '../../../api/auth';
import { errorMessage, isApiError } from '../../../api/client';
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { checkFields, useField } from '../../../utils/useField';
import { PASSWORD_RULES, validatePassword } from '../../../utils/validation';
import styles from './ChangePasswordForm.module.css';

const requireCurrent = (value: string) => (value ? null : 'Введите текущий пароль');

interface ChangePasswordFormProps {
  /** Пароль сменён — родитель сбрасывает форму и показывает сообщение. */
  onChanged: () => void;
}

/** Смена пароля: текущий + новый (domain.md, раздел 7.6). */
export function ChangePasswordForm({ onChanged }: ChangePasswordFormProps) {
  const current = useField(requireCurrent);
  const next = useField(validatePassword);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    if (!checkFields([current, next])) return;
    setSubmitting(true);
    try {
      await changePassword(current.value, next.value);
      onChanged();
    } catch (error) {
      if (isApiError(error) && error.code === 'invalid_password') {
        // «Неверный текущий пароль» относится к полю — показываем под ним.
        current.setError(error.message);
        current.focus();
      } else {
        setFormError(errorMessage(error));
      }
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError && <Alert>{formError}</Alert>}
      <Input
        label="Текущий пароль"
        name="current-password"
        type="password"
        autoComplete="current-password"
        required
        {...current.inputProps}
      />
      <Input
        label="Новый пароль"
        hint={`От ${PASSWORD_RULES.minLength} до ${PASSWORD_RULES.maxLength} символов`}
        name="new-password"
        type="password"
        autoComplete="new-password"
        required
        {...next.inputProps}
      />
      <Button type="submit" className={styles.submit} loading={submitting}>
        Сменить пароль
      </Button>
    </form>
  );
}
