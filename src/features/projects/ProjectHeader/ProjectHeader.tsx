import { PageHeader } from '../../../components/PageHeader';
import type { Project } from '../../../types';
import { ProjectActions } from '../ProjectActions';
import { RoleBadge } from '../RoleBadge';
import { ProjectTabs } from '../ProjectTabs';
import styles from './ProjectHeader.module.css';

interface ProjectHeaderProps {
  project: Project;
  onRenamed: () => void;
}

/** Шапка проекта: название, моя роль, меню действий и вкладки. */
export function ProjectHeader({ project, onRenamed }: ProjectHeaderProps) {
  return (
    <div className={styles.header}>
      <PageHeader
        title={project.name}
        meta={
          <>
            <span>Моя роль:</span>
            <RoleBadge role={project.myRole} />
          </>
        }
        actions={<ProjectActions project={project} onRenamed={onRenamed} />}
      />
      <ProjectTabs project={project} />
    </div>
  );
}
