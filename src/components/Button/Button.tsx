import type { ComponentProps } from 'react';
import { Spinner } from '../Spinner';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  /** Квадратная кнопка с одной иконкой; подпись — через aria-label. */
  iconOnly?: boolean;
  /** Идёт операция: кнопка блокируется, чтобы не отправить дважды. */
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  iconOnly = false,
  loading = false,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], fullWidth && styles.fullWidth, iconOnly && styles.iconOnly, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}
