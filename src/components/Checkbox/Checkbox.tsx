import { useId, type ComponentProps, type ReactNode } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<ComponentProps<'input'>, 'id' | 'type'> {
  label: ReactNode;
  error?: string;
}

export function Checkbox({ label, error, className, ...rest }: CheckboxProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
