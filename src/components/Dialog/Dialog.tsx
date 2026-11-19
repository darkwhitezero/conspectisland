import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import styles from './Dialog.module.css';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Кнопки внизу окна. Кнопка отправки формы связывается с ней атрибутом form. */
  footer?: ReactNode;
  /** wide — для просмотра содержимого (текст, изображение) */
  size?: 'default' | 'wide';
}

/**
 * Модальное окно на нативном <dialog>: браузер сам держит фокус внутри,
 * закрывает по Esc и возвращает фокус на кнопку, которая окно открыла.
 * Содержимое монтируется только в открытом состоянии — формы каждый раз
 * начинаются с чистого листа.
 */
export function Dialog({ open, onClose, title, children, footer, size = 'default' }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // React не выставляет атрибут autofocus, поэтому помечаем поле data-атрибутом.
      dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={[styles.dialog, size === 'wide' && styles.wide].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      onClose={onClose}
    >
      {open && (
        <>
          <header className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <Button variant="ghost" iconOnly aria-label="Закрыть" onClick={onClose}>
              <Icon name="close" />
            </Button>
          </header>
          <div className={styles.body}>{children}</div>
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </>
      )}
    </dialog>
  );
}
