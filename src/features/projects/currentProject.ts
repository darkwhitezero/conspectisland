import { useOutletContext } from 'react-router-dom';
import type { Project } from '../../types';

/** Что экран проекта передаёт своим вкладкам через <Outlet context>. */
export interface CurrentProjectContext {
  project: Project;
  /** Перезапросить проект — например, после переименования. */
  reloadProject: () => void;
}

export function useCurrentProject(): CurrentProjectContext {
  return useOutletContext<CurrentProjectContext>();
}
