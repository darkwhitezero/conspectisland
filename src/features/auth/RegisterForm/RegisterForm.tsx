import { useRef, useState, type FormEvent } from 'react';
import { isApiError } from '../../../api/client';
import { useAuth } from '../../../app/AuthProvider';
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';
import { Checkbox } from '../../../components/Checkbox';
import { Input } from '../../../components/Input';
import { CONSENT_TEXT } from '../../../utils/labels';
import { checkFields, useField } from '../../../utils/useField';
import { LOGIN_RULES, PASSWORD_RULES, validateLogin, validatePassword } from '../../../utils/validation';
import styles from './RegisterForm.module.css';

const LOGIN_HINT = `${LOGIN_RULES.minLength}–${LOGIN_RULES.maxLength} символа: латинские буквы, цифры и\u00a0_`;
const PASSWORD_HINT = `От ${PASSWORD_RULES.minLength} до ${PASSWORD_RULES.maxLength} символов`;
const CONSENT_REQUIRED = 'Отметьте согласие, чтобы зарегистрироваться';

export function RegisterForm() {
  const { register } = useAuth();
  const loginField = useField(validateLogin);
  const passwordField = useField(validatePassword);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    const fieldsValid = checkFields([loginField, passwordField]);
    setConsentError(consent ? null : CONSENT_REQUIRED);
    if (!fieldsValid) return;
    if (!consent) {
      consentRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await register(loginField.value, passwordField.value);
    } catch (error) {
      if (isApiError(error) && error.code === 'login_taken') {
        // Ошибка относится к полю — показываем её под логином.
        loginField.setError(error.message);
        loginField.focus();
      } else {
        setFormError(isApiError(error) ? error.message : 'Не удалось зарегистрироваться. Попробуйте ещё раз');
      }
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError && <Alert>{formError}</Alert>}
      <Input
        label="Логин"
        hint={LOGIN_HINT}
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
        hint={PASSWORD_HINT}
        name="password"
        type="password"
        autoComplete="new-password"
        enterKeyHint="next"
        required
        {...passwordField.inputProps}
      />
      <Checkbox
        ref={consentRef}
        name="consent"
        label={CONSENT_TEXT}
        checked={consent}
        onChange={(event) => {
          setConsent(event.target.checked);
          if (event.target.checked) setConsentError(null);
        }}
        error={consentError ?? undefined}
        required
      />
      <Button type="submit" fullWidth loading={submitting}>
        Зарегистрироваться
      </Button>
    </form>
  );
}
