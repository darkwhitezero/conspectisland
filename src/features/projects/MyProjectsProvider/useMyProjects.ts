import { use } from 'react';
import { MyProjectsContext, type MyProjectsContextValue } from './myProjectsContext';

export function useMyProjects(): MyProjectsContextValue {
  const context = use(MyProjectsContext);
  if (!context) throw new Error('useMyProjects должен вызываться внутри MyProjectsProvider');
  return context;
}
