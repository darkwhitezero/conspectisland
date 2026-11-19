import { createId, db, type ProjectRecord } from '../mocks/db';
import type { Project, ProjectRole } from '../types';
import { requireProjectAccess, roleOf } from './access';
import { delay } from './client';
import { requireUserId } from './session';

export function inviteLinkFor(token: string): string {
  const origin = globalThis.location?.origin ?? '';
  return `${origin}/join/${token}`;
}

function toProject(record: ProjectRecord, myRole: ProjectRole): Project {
  const project: Project = {
    id: record.id,
    name: record.name,
    ownerId: record.ownerId,
    accessPolicy: record.accessPolicy,
    createdAt: record.createdAt,
    myRole,
  };
  // Ссылку видит только владелец и только при политике «По ссылке».
  if (myRole === 'owner' && record.accessPolicy === 'LINK' && record.inviteToken) {
    project.inviteLink = inviteLinkFor(record.inviteToken);
  }
  return project;
}

/** Проекты, где у текущего пользователя есть роль; новые — первыми. */
export async function listMyProjects(): Promise<Project[]> {
  await delay();
  const userId = requireUserId();
  return db.projects
    .flatMap((record) => {
      const role = roleOf(record, userId);
      return role ? [toProject(record, role)] : [];
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProject(projectId: string): Promise<Project> {
  await delay();
  const { project, role } = requireProjectAccess(projectId);
  return toProject(project, role);
}

/** Новый проект: владелец — текущий пользователь, политика «Только владелец». */
export async function createProject(name: string): Promise<Project> {
  await delay();
  const userId = requireUserId();
  const record: ProjectRecord = {
    id: createId('p'),
    name,
    ownerId: userId,
    accessPolicy: 'PRIVATE',
    createdAt: new Date().toISOString(),
  };
  db.projects.push(record);
  return toProject(record, 'owner');
}

export async function renameProject(projectId: string, name: string): Promise<Project> {
  await delay();
  const { project } = requireProjectAccess(projectId, 'renameProject');
  project.name = name;
  return toProject(project, 'owner');
}

/** Удаляет проект вместе с конспектами и участниками. */
export async function deleteProject(projectId: string): Promise<void> {
  await delay();
  requireProjectAccess(projectId, 'deleteProject');
  const conspectIds = new Set(db.conspects.filter((c) => c.projectId === projectId).map((c) => c.id));
  db.projects = db.projects.filter((p) => p.id !== projectId);
  db.memberships = db.memberships.filter((m) => m.projectId !== projectId);
  db.conspects = db.conspects.filter((c) => !conspectIds.has(c.id));
  db.files = db.files.filter((f) => !conspectIds.has(f.conspectId));
  conspectIds.forEach((id) => delete db.html[id]);
}

/** Копия конспекта с файлами и HTML; ссылки «распознан из» ведут на копии изображений. */
function copyConspect(conspectId: string, projectId: string): void {
  const source = db.conspects.find((c) => c.id === conspectId);
  if (!source) return;
  const copy = { ...structuredClone(source), id: createId('c'), projectId };
  db.conspects.push(copy);
  const files = db.files.filter((f) => f.conspectId === conspectId);
  const newIds = new Map(files.map((f) => [f.id, createId('f')]));
  for (const file of files) {
    const fileCopy = { ...structuredClone(file), id: newIds.get(file.id)!, conspectId: copy.id };
    if (file.ocrSourceFileId) fileCopy.ocrSourceFileId = newIds.get(file.ocrSourceFileId);
    db.files.push(fileCopy);
  }
  if (db.html[conspectId]) db.html[copy.id] = db.html[conspectId];
}

/**
 * Форк — независимая копия со всеми конспектами. Владелец — тот, кто
 * создал форк; участники не копируются, политика «Только владелец».
 */
export async function forkProject(projectId: string, name: string): Promise<Project> {
  await delay();
  const { userId } = requireProjectAccess(projectId, 'fork');
  const fork: ProjectRecord = {
    id: createId('p'),
    name,
    ownerId: userId,
    accessPolicy: 'PRIVATE',
    createdAt: new Date().toISOString(),
  };
  db.projects.push(fork);
  db.conspects.filter((c) => c.projectId === projectId).forEach((c) => copyConspect(c.id, fork.id));
  return toProject(fork, 'owner');
}

export async function leaveProject(projectId: string): Promise<void> {
  await delay();
  const { userId } = requireProjectAccess(projectId, 'leaveProject');
  db.memberships = db.memberships.filter((m) => !(m.projectId === projectId && m.userId === userId));
}
