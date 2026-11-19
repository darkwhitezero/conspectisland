import { useState } from 'react';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { PageHeader } from '../../components/PageHeader';
import { Spinner } from '../../components/Spinner';
import { CreateProjectDialog } from '../../features/projects/CreateProjectDialog';
import { useMyProjects } from '../../features/projects/MyProjectsProvider';
import { ProjectList } from '../../features/projects/ProjectList';
import styles from './ProjectsPage.module.css';

export function ProjectsPage() {
  const { projects, status, error, reload } = useMyProjects();
  const [createOpen, setCreateOpen] = useState(false);

  const createButton = (
    <Button onClick={() => setCreateOpen(true)}>
      <Icon name="plus" />
      Создать проект
    </Button>
  );
  const isEmpty = projects?.length === 0;

  return (
    <div className={styles.page}>
      <title>Мои проекты — ConspectIsland</title>
      {status === 'error' && <Alert>{error}</Alert>}
      <PageHeader title="Мои проекты" actions={!isEmpty && createButton} />

      {status === 'loading' && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
      {projects && !isEmpty && <ProjectList projects={projects} />}
      {isEmpty && (
        <EmptyState
          title="Проектов пока нет"
          description="Создайте проект для учебного предмета — в нём будут храниться конспекты."
          action={createButton}
        />
      )}

      <CreateProjectDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          reload();
        }}
      />
    </div>
  );
}
