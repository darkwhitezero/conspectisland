import { NavLink } from 'react-router-dom';
import { Spinner } from '../../../components/Spinner';
import { useMyProjects } from '../MyProjectsProvider';
import styles from './ProjectNav.module.css';

interface ProjectNavProps {
  /** Вызывается при переходе по ссылке — меню по кнопке закрывается. */
  onNavigate?: () => void;
}

/** Навигация: «Мои проекты» и быстрый переход в каждый проект. */
export function ProjectNav({ onNavigate }: ProjectNavProps) {
  const { projects, status } = useMyProjects();
  const linkClass = ({ isActive }: { isActive: boolean }) => [styles.link, isActive && styles.active].filter(Boolean).join(' ');

  return (
    <nav className={styles.nav} aria-label="Основная навигация">
      <NavLink to="/projects" end className={linkClass} onClick={onNavigate}>
        Мои проекты
      </NavLink>
      {status === 'loading' && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
      {projects && projects.length > 0 && (
        <ul className={styles.projects} aria-label="Проекты">
          {projects.map((project) => (
            <li key={project.id}>
              <NavLink to={`/projects/${project.id}`} className={linkClass} onClick={onNavigate}>
                {project.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
