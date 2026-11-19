import { Link } from 'react-router-dom';
import type { Project } from '../../../types';
import { formatDateTime } from '../../../utils/format';
import { RoleBadge } from '../RoleBadge';
import styles from './ProjectListItem.module.css';

export function ProjectListItem({ project }: { project: Project }) {
  return (
    <li className={styles.card}>
      <h2 className={styles.name}>
        {/* Ссылка растянута на всю карточку через ::after */}
        <Link className={styles.link} to={`/projects/${project.id}`}>
          {project.name}
        </Link>
      </h2>
      <div className={styles.meta}>
        <RoleBadge role={project.myRole} />
        <span>
          Создан <time dateTime={project.createdAt}>{formatDateTime(project.createdAt)}</time>
        </span>
      </div>
    </li>
  );
}
