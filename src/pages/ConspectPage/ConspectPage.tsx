import { useCallback, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ApiError } from '../../api/client';
import { getConspect } from '../../api/conspects';
import { listFiles } from '../../api/files';
import { getProject } from '../../api/projects';
import { Alert } from '../../components/Alert';
import { EmptyState } from '../../components/EmptyState';
import { LinkButton } from '../../components/LinkButton';
import { SegmentedControl } from '../../components/SegmentedControl';
import { Spinner } from '../../components/Spinner';
import { ConspectHeader } from '../../features/conspects/ConspectHeader';
import { FilesPanel } from '../../features/conspects/FilesPanel';
import { HtmlView } from '../../features/conspects/HtmlView';
import { StagesPanel } from '../../features/conspects/StagesPanel';
import { HTML_OUTDATED_MESSAGE } from '../../utils/labels';
import { can } from '../../utils/permissions';
import { useAsync } from '../../utils/useAsync';
import { usePolling } from '../../utils/usePolling';
import styles from './ConspectPage.module.css';

type View = 'html' | 'files';

const VIEW_OPTIONS: { value: View; label: string }[] = [
  { value: 'html', label: 'HTML-представление' },
  { value: 'files', label: 'Исходные файлы' },
];

/** Пока этап в очереди или выполняется, статусы обновляются раз в 5 секунд. */
const POLL_INTERVAL_MS = 5000;

export function ConspectPage() {
  const { projectId = '', conspectId = '' } = useParams();
  const load = useCallback(async () => {
    const [project, conspect, files] = await Promise.all([getProject(projectId), getConspect(conspectId), listFiles(conspectId)]);
    if (conspect.projectId !== project.id) throw new ApiError('not_found', 'Конспект не найден');
    return { project, conspect, files };
  }, [projectId, conspectId]);
  const { status, data, error, reload } = useAsync(load);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const processing = data?.conspect.stages.some((s) => s.status === 'queued' || s.status === 'running') ?? false;
  usePolling(reload, POLL_INTERVAL_MS, processing);

  // Вид по умолчанию выбирается один раз, при открытии: есть HTML — оно,
  // нет — список файлов. Если HTML появится позже, экран не перескочит сам.
  const [defaultView, setDefaultView] = useState<View | null>(null);
  if (data && defaultView === null) setDefaultView(data.conspect.hasHtml ? 'html' : 'files');

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
        description="Возможно, конспект удалён или у вас нет к нему доступа."
        action={<LinkButton to={`/projects/${projectId}`}>К проекту</LinkButton>}
      />
    );
  }

  const { project, conspect, files } = data;
  const role = project.myRole;
  const requested = searchParams.get('view') ?? defaultView;
  const view: View = conspect.hasHtml && requested === 'html' ? 'html' : 'files';
  const changed = () => {
    setOperationError(null);
    reload();
  };

  return (
    <div className={styles.page}>
      <title>{`${conspect.name} — ConspectIsland`}</title>
      <ConspectHeader project={project} conspect={conspect} onRenamed={reload} />
      {operationError && <Alert>{operationError}</Alert>}

      <StagesPanel conspect={conspect} canRun={can(role, 'runStage')} onChanged={changed} onError={setOperationError} />

      {conspect.hasHtml && conspect.htmlOutdated && <Alert tone="warning">{HTML_OUTDATED_MESSAGE}</Alert>}

      {conspect.hasHtml && (
        <SegmentedControl
          label="Вид конспекта"
          options={VIEW_OPTIONS}
          value={view}
          onChange={(next) => setSearchParams({ view: next }, { replace: true })}
        />
      )}

      {view === 'html' ? (
        // Новое HTML готово — key меняется, и представление загружается заново.
        <HtmlView key={`${conspect.id}-${conspect.htmlOutdated}`} conspect={conspect} />
      ) : (
        <FilesPanel
          conspectId={conspect.id}
          files={files}
          canEdit={can(role, 'editFiles')}
          onChanged={changed}
          onError={setOperationError}
        />
      )}
    </div>
  );
}
