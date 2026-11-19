// Проверки доступа внутри мок-API — то же, что сделает сервер.
import { db, type ProjectRecord } from '../mocks/db';
import type { ProjectRole } from '../types';
import { can, type ProjectAction } from '../utils/permissions';
import { ApiError } from './client';
import { requireUserId } from './session';

export function roleOf(project: ProjectRecord, userId: string): ProjectRole | null {
  if (project.ownerId === userId) return 'owner';
  const membership = db.memberships.find((m) => m.projectId === project.id && m.userId === userId);
  return membership?.role ?? null;
}

/**
 * Проект, в котором у текущего пользователя есть роль (и право на action).
 * Чужой проект неотличим от несуществующего — так не раскрывается его наличие.
 */
export function requireProjectAccess(projectId: string, action?: ProjectAction) {
  const userId = requireUserId();
  const project = db.projects.find((p) => p.id === projectId);
  const role = project ? roleOf(project, userId) : null;
  if (!project || !role) throw new ApiError('not_found', 'Проект не найден');
  if (action && !can(role, action)) throw new ApiError('forbidden', 'Недостаточно прав для этого действия');
  return { project, role, userId };
}
