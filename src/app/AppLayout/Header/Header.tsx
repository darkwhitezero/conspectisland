import { Link } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import { Logo } from '../../../components/Logo';
import { UserMenu } from '../../../features/auth/UserMenu';
import styles from './Header.module.css';

interface HeaderProps {
  /** Открыть меню по кнопке (только на узком экране) */
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Button variant="ghost" iconOnly className={styles.menuButton} aria-label="Открыть меню" onClick={onMenuClick}>
        <Icon name="menu" />
      </Button>
      <Link to="/projects" className={styles.logoLink} aria-label="ConspectIsland — Мои проекты">
        <Logo size="header" />
      </Link>
      <div className={styles.end}>
        <UserMenu />
      </div>
    </header>
  );
}
