import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listConspects } from '../../api/conspects';
import { Alert } from '../../components/Alert';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { LinkButton } from '../../components/LinkButton';
import { Spinner } from '../../components/Spinner';
import { ConspectList } from '../../features/conspects/ConspectList';
import { ConspectSort } from '../../features/conspects/ConspectSort';
import { parseConspectSort, sortConspects } from '../../features/conspects/sortConspects';
import { useCurrentProject } from '../../features/projects/currentProject';
import { can } from '../../utils/permissions';
import { useAsync } from '../../utils/useAsync';
import styles from './ProjectConspectsPage.module.css';

/** Вкладка «Конспекты»: список с сортировкой (выбор хранится в ?sort=). */
export function ProjectConspectsPage() {
  const { project } = useCurrentProject();
  const load = useCallback(() => listConspects(project.id), [project.id]);
  const { status, data: conspects, error } = useAsync(load);
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = parseConspectSort(searchParams.get('sort'));
  const canCreate = can(project.myRole, 'createConspect');

  const newConspectButton = canCreate && (
    <LinkButton to={`/projects/${project.id}/conspects/new`}>
      <Icon name="plus" />
      Новый конспект
    </LinkButton>
  );

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <Spinner />
      </div>
    );
  }
  if (status === 'error') return <Alert>{error}</Alert>;

  if (conspects.length === 0) {
    return (
      <EmptyState
        title="Конспектов пока нет"
        description={
          canCreate
            ? 'Добавьте первый конспект: загрузите файлы TXT или MD либо фотографии страниц.'
            : 'Когда участники проекта добавят конспекты, они появятся здесь.'
        }
        action={newConspectButton}
      />
    );
  }

  return (
    <section className={styles.section} aria-label="Конспекты">
      <div className={styles.toolbar}>
        <ConspectSort
          value={sort}
          onChange={(next) =>
            setSearchParams(
              (params) => {
                params.set('sort', next);
                return params;
              },
              { replace: true },
            )
          }
        />
        {newConspectButton}
      </div>
      <ConspectList conspects={sortConspects(conspects, sort)} />
    </section>
  );
}
