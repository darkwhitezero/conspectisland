import { createId, db, type ProjectRecord } from '../mocks/db';
import type { Project, ProjectRole } from '../types';
import { delay } from './client';
import { requireUserId } from './session';

function roleOf(project: ProjectRecord, userId: string): ProjectRole | null {
  if (project.ownerId === userId) return 'owner';
  const membership = db.memberships.find((m) => m.projectId === project.id && m.userId === userId);
  return membership?.role ?? null;
}

function inviteLinkFor(token: string): string {
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
