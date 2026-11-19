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

/** Конспект и роль в его проекте — с той же проверкой прав. */
export function requireConspectAccess(conspectId: string, action?: ProjectAction) {
  const conspect = db.conspects.find((c) => c.id === conspectId);
  if (!conspect) throw new ApiError('not_found', 'Конспект не найден');
  try {
    return { conspect, ...requireProjectAccess(conspect.projectId, action) };
  } catch (error) {
    if (error instanceof ApiError && error.code === 'not_found') throw new ApiError('not_found', 'Конспект не найден');
    throw error;
  }
}

/** Файл и его конспект — с той же проверкой прав. */
export function requireFileAccess(fileId: string, action?: ProjectAction) {
  const file = db.files.find((f) => f.id === fileId);
  if (!file) throw new ApiError('not_found', 'Файл не найден');
  return { file, ...requireConspectAccess(file.conspectId, action) };
}
