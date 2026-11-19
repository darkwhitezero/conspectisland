import { useId, type ComponentProps } from 'react';
import styles from './Select.module.css';

interface SelectProps extends Omit<ComponentProps<'select'>, 'id'> {
  label: string;
  options: { value: string; label: string }[];
  /** Подпись видна только дикторам — когда смысл ясен из контекста */
  hideLabel?: boolean;
}

export function Select({ label, options, hideLabel = false, className, ...rest }: SelectProps) {
  const id = useId();

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label className={hideLabel ? 'visually-hidden' : styles.label} htmlFor={id}>
        {label}
      </label>
      <select id={id} className={styles.select} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
