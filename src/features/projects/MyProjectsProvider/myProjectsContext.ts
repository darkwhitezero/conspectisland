import { createContext } from 'react';
import type { Project } from '../../../types';

export interface MyProjectsContextValue {
  status: 'loading' | 'success' | 'error';
  projects: Project[] | undefined;
  error: string | undefined;
  /** Перезапросить список — после создания, переименования, удаления. */
  reload: () => void;
}

export const MyProjectsContext = createContext<MyProjectsContextValue | null>(null);
