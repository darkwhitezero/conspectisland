// In-memory «база данных» моков. Живёт до перезагрузки страницы.
import { seedConspects } from './seed/conspects';
import { seedMemberships, seedProjects, type MembershipRecord, type ProjectRecord } from './seed/projects';
import { seedUsers, type UserRecord } from './seed/users';

export type { MembershipRecord, ProjectRecord, UserRecord };

export const db = {
  users: structuredClone(seedUsers),
  projects: structuredClone(seedProjects),
  memberships: structuredClone(seedMemberships),
  conspects: structuredClone(seedConspects),
};

export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}
