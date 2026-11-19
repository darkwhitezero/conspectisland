import { useMemo, type ReactNode } from 'react';
import { listMyProjects } from '../../../api/projects';
import { useAsync } from '../../../utils/useAsync';
import { MyProjectsContext } from './myProjectsContext';

/**
 * Один список «Моих проектов» на всё приложение: его показывают и страница,
 * и боковая панель, поэтому после изменений оба места обновляются сразу.
 */
export function MyProjectsProvider({ children }: { children: ReactNode }) {
  const { status, data, error, reload } = useAsync(listMyProjects);
  const value = useMemo(() => ({ status, projects: data, error, reload }), [status, data, error, reload]);
  return <MyProjectsContext value={value}>{children}</MyProjectsContext>;
}
