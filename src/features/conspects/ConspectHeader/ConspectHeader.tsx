import { Link } from 'react-router-dom';
import { Icon } from '../../../components/Icon';
import { PageHeader } from '../../../components/PageHeader';
import type { Conspect, Project } from '../../../types';
import { formatDateTime } from '../../../utils/format';
import { ConspectActions } from '../ConspectActions';
import styles from './ConspectHeader.module.css';

interface ConspectHeaderProps {
  project: Project;
  conspect: Conspect;
  onRenamed: () => void;
}

/** Шапка конспекта: возврат в проект, название, дата создания, меню действий. */
export function ConspectHeader({ project, conspect, onRenamed }: ConspectHeaderProps) {
  return (
    <div className={styles.header}>
      <Link className={styles.back} to={`/projects/${project.id}`}>
        <Icon name="chevronLeft" />
        {project.name}
      </Link>
      <PageHeader
        title={conspect.name}
        meta={
          <span>
            Создан <time dateTime={conspect.createdAt}>{formatDateTime(conspect.createdAt)}</time>
          </span>
        }
        actions={<ConspectActions conspect={conspect} role={project.myRole} onRenamed={onRenamed} />}
      />
    </div>
  );
}
