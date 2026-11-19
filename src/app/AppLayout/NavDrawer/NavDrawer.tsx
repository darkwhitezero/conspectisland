import { useEffect, useRef, type MouseEvent } from 'react';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import { ProjectNav } from '../../../features/projects/ProjectNav';
import styles from './NavDrawer.module.css';

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** Меню по кнопке на узком экране: выезжает слева, закрывается Esc, кликом мимо и переходом. */
export function NavDrawer({ open, onClose }: NavDrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // Клик по самому <dialog> — это клик по затемнению вокруг панели.
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog ref={ref} className={styles.drawer} aria-label="Меню" onClose={onClose} onClick={handleBackdropClick}>
      <div className={styles.panel}>
        <div className={styles.top}>
          <Button variant="ghost" iconOnly aria-label="Закрыть меню" onClick={onClose}>
            <Icon name="close" />
          </Button>
        </div>
        <ProjectNav onNavigate={onClose} />
      </div>
    </dialog>
  );
}
