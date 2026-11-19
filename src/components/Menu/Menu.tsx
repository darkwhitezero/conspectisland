import { useId, useRef, useState, type KeyboardEvent, type ReactNode, type ToggleEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from './Menu.module.css';

export type MenuItem =
  | { label: string; to: string; tone?: 'danger' }
  | { label: string; onSelect: () => void; tone?: 'danger' };

interface MenuProps {
  /** Содержимое кнопки-триггера */
  trigger: ReactNode;
  /** Подпись триггера для дикторов, если в нём нет текста */
  triggerLabel?: string;
  triggerClassName?: string;
  /** Неинтерактивная шапка списка (например, логин пользователя) */
  header?: ReactNode;
  items: MenuItem[];
}

/**
 * Выпадающее меню на Popover API: закрытие по Esc и клику мимо, слой
 * поверх страницы и возврат фокуса на триггер браузер делает сам.
 * Стрелки, Home и End переводят фокус между пунктами.
 */
export function Menu({ trigger, triggerLabel, triggerClassName, header, items }: MenuProps) {
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const menuItems = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
  const close = () => menuRef.current?.hidePopover();

  // Фокус — на триггер до действия: если пункт открывает диалог, после его
  // закрытия браузер вернёт фокус сюда, а не на скрытый пункт меню.
  const select = (action: () => void) => {
    close();
    triggerRef.current?.focus();
    action();
  };

  const handleToggle = (event: ToggleEvent<HTMLDivElement>) => {
    const isOpen = event.newState === 'open';
    setOpen(isOpen);
    if (isOpen) menuItems()[0]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const list = menuItems();
    const index = list.indexOf(document.activeElement as HTMLElement);
    const moves: Record<string, number> = {
      ArrowDown: (index + 1) % list.length,
      ArrowUp: (index - 1 + list.length) % list.length,
      Home: 0,
      End: list.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      list[moves[event.key]]?.focus();
    } else if (event.key === 'Tab') {
      close();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={[styles.trigger, triggerClassName].filter(Boolean).join(' ')}
        popoverTarget={menuId}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={triggerLabel}
      >
        {trigger}
      </button>
      <div
        ref={menuRef}
        id={menuId}
        popover="auto"
        role="menu"
        className={styles.menu}
        onToggle={handleToggle}
        onKeyDown={handleKeyDown}
      >
        {header && <div className={styles.header}>{header}</div>}
        {items.map((item) => {
          const className = [styles.item, item.tone === 'danger' && styles.danger].filter(Boolean).join(' ');
          return 'to' in item ? (
            <Link key={item.label} role="menuitem" tabIndex={-1} className={className} to={item.to} onClick={close}>
              {item.label}
            </Link>
          ) : (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              tabIndex={-1}
              className={className}
              onClick={() => select(item.onSelect)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
