import type { ComponentProps } from 'react';
import { Spinner } from '../Spinner';
import { buttonClasses, type ButtonLook } from './buttonClasses';

interface ButtonProps extends ComponentProps<'button'>, ButtonLook {
  /** Идёт операция: кнопка блокируется, чтобы не отправить дважды. */
  loading?: boolean;
}

export function Button({
  variant,
  size,
  fullWidth,
  iconOnly,
  loading = false,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, iconOnly }, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
