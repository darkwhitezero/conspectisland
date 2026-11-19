import { db } from '../mocks/db';
import type { AccessPolicy, ProjectMember } from '../types';
import { requireProjectAccess } from './access';
import { ApiError, delay } from './client';
import { inviteLinkFor } from './projects';

/** Политика доступа и ссылка-приглашение (ссылка есть только при LINK). */
export interface ProjectAccess {
  accessPolicy: AccessPolicy;
  inviteLink?: string;
}

function accessOf(projectId: string): ProjectAccess {
  const project = db.projects.find((p) => p.id === projectId)!;
  return project.accessPolicy === 'LINK' && project.inviteToken
    ? { accessPolicy: 'LINK', inviteLink: inviteLinkFor(project.inviteToken) }
    : { accessPolicy: 'PRIVATE' };
}

export async function getAccess(projectId: string): Promise<ProjectAccess> {
  await delay();
  requireProjectAccess(projectId, 'manageAccess');
  return accessOf(projectId);
}

/**
 * «Только владелец» удаляет всех участников и аннулирует ссылку.
 * «По ссылке» выдаёт новую ссылку — старая, если была, больше не работает.
 */
export async function setAccessPolicy(projectId: string, policy: AccessPolicy): Promise<ProjectAccess> {
  await delay();
  const { project } = requireProjectAccess(projectId, 'manageAccess');
  if (project.accessPolicy === policy) return accessOf(projectId);
  project.accessPolicy = policy;
  if (policy === 'PRIVATE') {
    delete project.inviteToken;
    db.memberships = db.memberships.filter((m) => m.projectId !== projectId);
  } else {
    project.inviteToken = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  }
  return accessOf(projectId);
}

/** Участники проекта (без владельца) — в порядке присоединения. */
export async function listMembers(projectId: string): Promise<ProjectMember[]> {
  await delay();
  requireProjectAccess(projectId, 'manageAccess');
  return db.memberships
    .filter((m) => m.projectId === projectId)
    .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt))
    .map((m) => ({
      userId: m.userId,
      login: db.users.find((u) => u.id === m.userId)?.login ?? '—',
      role: m.role,
      joinedAt: m.joinedAt,
    }));
}

function requireMembership(projectId: string, userId: string) {
  requireProjectAccess(projectId, 'manageAccess');
  const membership = db.memberships.find((m) => m.projectId === projectId && m.userId === userId);
  if (!membership) throw new ApiError('not_found', 'Участник не найден');
  return membership;
}

export async function changeMemberRole(projectId: string, userId: string, role: ProjectMember['role']): Promise<void> {
  await delay();
  requireMembership(projectId, userId).role = role;
}

/** Исключённый может вернуться по действующей ссылке — блокировок в MVP нет. */
export async function removeMember(projectId: string, userId: string): Promise<void> {
  await delay();
  requireMembership(projectId, userId);
  db.memberships = db.memberships.filter((m) => !(m.projectId === projectId && m.userId === userId));
}
