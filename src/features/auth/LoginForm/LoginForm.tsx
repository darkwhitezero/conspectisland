import { useState, type FormEvent } from 'react';
import { isApiError } from '../../../api/client';
import { useAuth } from '../../../app/AuthProvider';
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { checkFields, useField } from '../../../utils/useField';
import { validateLogin, validatePassword } from '../../../utils/validation';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const { login } = useAuth();
  const loginField = useField(validateLogin);
  const passwordField = useField(validatePassword);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    if (!checkFields([loginField, passwordField])) return;

    setSubmitting(true);
    try {
      // После успеха GuestOnly сам уведёт со страницы.
      await login(loginField.value, passwordField.value);
    } catch (error) {
      setFormError(isApiError(error) ? error.message : 'Не удалось войти. Попробуйте ещё раз');
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError && <Alert>{formError}</Alert>}
      <Input
        label="Логин"
        name="login"
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="next"
        required
        {...loginField.inputProps}
      />
      <Input
        label="Пароль"
        name="password"
        type="password"
        autoComplete="current-password"
        enterKeyHint="go"
        required
        {...passwordField.inputProps}
      />
      <Button type="submit" fullWidth loading={submitting}>
        Войти
      </Button>
    </form>
  );
}
