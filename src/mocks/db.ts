// In-memory «база данных» моков. Живёт до перезагрузки страницы.
import type { StageType } from '../types';
import { seedConspects } from './seed/conspects';
import { seedFiles, type FileRecord } from './seed/files';
import { seedHtml } from './seed/html';
import { seedMemberships, seedProjects, type MembershipRecord, type ProjectRecord } from './seed/projects';
import { seedUsers, type UserRecord } from './seed/users';

export type { FileRecord, MembershipRecord, ProjectRecord, UserRecord };

/** Когда этап поставлен в очередь: conspectId → этап → время в мс. */
export type StageTimers = Record<string, Partial<Record<StageType, number>>>;

export const db = {
  users: structuredClone(seedUsers),
  projects: structuredClone(seedProjects),
  memberships: structuredClone(seedMemberships),
  conspects: structuredClone(seedConspects),
  files: structuredClone(seedFiles),
  html: { ...seedHtml } as Record<string, string>,
  stageTimers: {} as StageTimers,
};

// Этапы, которые в сиде уже «в работе», стартуют при загрузке страницы,
// чтобы на демо было видно, как статусы меняются сами.
const startedAt = Date.now();
for (const conspect of db.conspects) {
  for (const stage of conspect.stages) {
    if (stage.status === 'queued' || stage.status === 'running') {
      const offset = stage.status === 'running' ? -3000 : 0;
      (db.stageTimers[conspect.id] ??= {})[stage.type] = startedAt + offset;
    }
  }
}

export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}
