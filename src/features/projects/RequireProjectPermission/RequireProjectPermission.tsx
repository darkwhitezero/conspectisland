import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { can, type ProjectAction } from '../../../utils/permissions';
import { useCurrentProject } from '../currentProject';

interface RequireProjectPermissionProps {
  action: ProjectAction;
  children: ReactNode;
}

/** Вкладка, недоступная роли, при прямом переходе по адресу ведёт на «Конспекты». */
export function RequireProjectPermission({ action, children }: RequireProjectPermissionProps) {
  const { project } = useCurrentProject();
  if (!can(project.myRole, action)) return <Navigate to={`/projects/${project.id}`} replace />;
  return children;
}
