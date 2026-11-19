import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonLook {
  variant?: ButtonVariant;
  /** sm — компактная кнопка для строк списка */
  size?: 'md' | 'sm';
  fullWidth?: boolean;
  /** Квадратная кнопка с одной иконкой; подпись — через aria-label. */
  iconOnly?: boolean;
}

/** Классы кнопки — общие для <button> и ссылки, оформленной как кнопка. */
export function buttonClasses({ variant = 'primary', size = 'md', fullWidth, iconOnly }: ButtonLook, extra?: string): string {
  return [
    styles.button,
    styles[variant],
    size === 'sm' && styles.small,
    fullWidth && styles.fullWidth,
    iconOnly && styles.iconOnly,
    extra,
  ]
    .filter(Boolean)
    .join(' ');
}
