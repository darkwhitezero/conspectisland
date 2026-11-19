import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonLook {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  /** Квадратная кнопка с одной иконкой; подпись — через aria-label. */
  iconOnly?: boolean;
}

/** Классы кнопки — общие для <button> и ссылки, оформленной как кнопка. */
export function buttonClasses({ variant = 'primary', fullWidth, iconOnly }: ButtonLook, extra?: string): string {
  return [styles.button, styles[variant], fullWidth && styles.fullWidth, iconOnly && styles.iconOnly, extra]
    .filter(Boolean)
    .join(' ');
}
