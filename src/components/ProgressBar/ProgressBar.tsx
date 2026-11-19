import { useId } from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  label: string;
  /** 0–100 */
  value: number;
}

/** Индикатор выполнения на нативном <progress> — дикторы озвучивают проценты. */
export function ProgressBar({ label, value }: ProgressBarProps) {
  const id = useId();
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <label htmlFor={id}>{label}</label>
        <span aria-hidden="true">{Math.round(value)} %</span>
      </div>
      <progress id={id} className={styles.progress} max={100} value={value} />
    </div>
  );
}
