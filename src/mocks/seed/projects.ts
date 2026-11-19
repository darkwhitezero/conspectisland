import type { AccessPolicy, ProjectMember } from '../../types';

export interface ProjectRecord {
  id: string;
  name: string;
  ownerId: string;
  accessPolicy: AccessPolicy;
  createdAt: string;
  /** Токен ссылки-приглашения; есть только при LINK */
  inviteToken?: string;
}

export interface MembershipRecord {
  projectId: string;
  userId: string;
  role: ProjectMember['role'];
  joinedAt: string;
}

export const seedProjects: ProjectRecord[] = [
  {
    id: 'p_db',
    name: 'Базы данных',
    ownerId: 'u_danis',
    accessPolicy: 'LINK',
    createdAt: '2026-09-02T10:30:00Z',
    inviteToken: 'db-7f3k9q',
  },
  {
    id: 'p_logic',
    name: 'Неклассические логики',
    ownerId: 'u_kirill',
    accessPolicy: 'LINK',
    createdAt: '2026-09-05T14:10:00Z',
    inviteToken: 'logic-2m8x4c',
  },
  {
    id: 'p_evm',
    name: 'ЭВМ и периферийные устройства',
    ownerId: 'u_alina',
    accessPolicy: 'LINK',
    createdAt: '2026-09-08T08:45:00Z',
    inviteToken: 'evm-5r1n7b',
  },
  {
    id: 'p_web',
    name: 'Интернет-программирование',
    ownerId: 'u_danis',
    accessPolicy: 'PRIVATE',
    createdAt: '2026-10-01T16:20:00Z',
  },
  {
    // Чужой закрытый проект: в «Моих проектах» danis_a его быть не должно.
    id: 'p_law',
    name: 'Правовые основы информационной безопасности',
    ownerId: 'u_timur',
    accessPolicy: 'PRIVATE',
    createdAt: '2026-09-10T11:00:00Z',
  },
];

export const seedMemberships: MembershipRecord[] = [
  { projectId: 'p_db', userId: 'u_kirill', role: 'editor', joinedAt: '2026-09-02T12:05:00Z' },
  { projectId: 'p_db', userId: 'u_alina', role: 'reader', joinedAt: '2026-09-03T09:40:00Z' },
  { projectId: 'p_db', userId: 'u_timur', role: 'reader', joinedAt: '2026-09-04T18:15:00Z' },
  { projectId: 'p_db', userId: 'u_sofia', role: 'editor', joinedAt: '2026-09-06T07:55:00Z' },
  { projectId: 'p_logic', userId: 'u_danis', role: 'editor', joinedAt: '2026-09-05T15:00:00Z' },
  { projectId: 'p_evm', userId: 'u_danis', role: 'reader', joinedAt: '2026-09-08T10:20:00Z' },
];
