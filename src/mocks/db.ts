// In-memory «база данных» моков. Живёт до перезагрузки страницы.
import { seedUsers, type UserRecord } from './seed/users';

export type { UserRecord };

export const db = {
  users: structuredClone(seedUsers),
};

export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}
