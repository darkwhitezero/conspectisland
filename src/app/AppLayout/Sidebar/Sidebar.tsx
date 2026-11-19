import { ProjectNav } from '../../../features/projects/ProjectNav';
import styles from './Sidebar.module.css';

/** Постоянная боковая панель — только от 768 px. */
export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <ProjectNav />
    </aside>
  );
}
