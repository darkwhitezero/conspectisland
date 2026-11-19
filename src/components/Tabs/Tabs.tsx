import { NavLink } from 'react-router-dom';
import styles from './Tabs.module.css';

export interface TabItem {
  label: string;
  to: string;
  /** Активна только при точном совпадении адреса */
  end?: boolean;
}

/**
 * Вкладки-ссылки: каждая — отдельный адрес, поэтому работают «Назад»,
 * закладки и открытие в новой вкладке. Активная помечена aria-current.
 */
export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  return (
    <nav className={styles.tabs} aria-label={label}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => [styles.tab, isActive && styles.active].filter(Boolean).join(' ')}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
