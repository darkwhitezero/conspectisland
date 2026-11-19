import { Link, useLocation } from 'react-router-dom';
import styles from './AuthSwitch.module.css';

export type AuthMode = 'login' | 'register';

const ITEMS: { mode: AuthMode; path: string; label: string }[] = [
  { mode: 'login', path: '/login', label: 'Вход' },
  { mode: 'register', path: '/register', label: 'Регистрация' },
];

/** Переключатель форм. Параметры адреса (?redirect=) сохраняются. */
export function AuthSwitch({ mode }: { mode: AuthMode }) {
  const { search } = useLocation();

  return (
    <nav className={styles.switch} aria-label="Вход или регистрация">
      {ITEMS.map((item) => (
        <Link
          key={item.mode}
          to={{ pathname: item.path, search }}
          className={styles.item}
          aria-current={item.mode === mode ? 'page' : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
