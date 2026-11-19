import { useCallback } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { getProject } from '../../api/projects';
import { EmptyState } from '../../components/EmptyState';
import { LinkButton } from '../../components/LinkButton';
import { Spinner } from '../../components/Spinner';
import type { CurrentProjectContext } from '../../features/projects/currentProject';
import { ProjectHeader } from '../../features/projects/ProjectHeader';
import { useAsync } from '../../utils/useAsync';
import styles from './ProjectPage.module.css';

/** Экран проекта: шапка с вкладками; содержимое вкладки — во вложенном маршруте. */
export function ProjectPage() {
  const { projectId = '' } = useParams();
  const load = useCallback(() => getProject(projectId), [projectId]);
  const { status, data: project, error, reload } = useAsync(load);

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <Spinner />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <EmptyState
        title={error}
        description="Возможно, проект удалён или у вас больше нет к нему доступа."
        action={<LinkButton to="/projects">Мои проекты</LinkButton>}
      />
    );
  }

  const context: CurrentProjectContext = { project, reloadProject: reload };

  return (
    <div className={styles.page}>
      <title>{`${project.name} — ConspectIsland`}</title>
      <ProjectHeader project={project} onRenamed={reload} />
      <Outlet context={context} />
    </div>
  );
}
