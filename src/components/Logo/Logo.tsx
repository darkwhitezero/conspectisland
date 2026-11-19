import logoUrl from '../../../images/logo.png';
import styles from './Logo.module.css';

// Исходные размеры файла — задают пропорции и резервируют место до загрузки.
const LOGO_WIDTH = 460;
const LOGO_HEIGHT = 306;

interface LogoProps {
  size: 'auth';
}

export function Logo({ size }: LogoProps) {
  return (
    <img
      className={`${styles.logo} ${styles[size]}`}
      src={logoUrl}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      alt="ConspectIsland"
    />
  );
}
