import styles from './Spinner.module.css';

interface SpinnerProps {
  /** Крупный индикатор по центру экрана — пока грузится страница. */
  page?: boolean;
  label?: string;
}

export function Spinner({ page = false, label = 'Загрузка…' }: SpinnerProps) {
  if (page) {
    return (
      <div className={styles.page} role="status">
        <span className={`${styles.spinner} ${styles.large}`} aria-hidden="true" />
        <span className="visually-hidden">{label}</span>
      </div>
    );
  }
  return <span className={styles.spinner} aria-hidden="true" />;
}
