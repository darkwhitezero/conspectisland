import type { User } from '../../types';

export interface UserRecord extends User {
  password: string;
}

/** Общий пароль всех демо-пользователей (указан в README). */
export const DEMO_PASSWORD = 'island2026';

export const seedUsers: UserRecord[] = [
  { id: 'u_danis', login: 'danis_a', systemRole: 'user', createdAt: '2026-09-01T09:15:00Z', password: DEMO_PASSWORD },
  { id: 'u_kirill', login: 'kirill_m', systemRole: 'user', createdAt: '2026-09-01T10:02:00Z', password: DEMO_PASSWORD },
  { id: 'u_alina', login: 'alina_s', systemRole: 'user', createdAt: '2026-09-02T08:40:00Z', password: DEMO_PASSWORD },
  { id: 'u_timur', login: 'timur_g', systemRole: 'user', createdAt: '2026-09-03T17:25:00Z', password: DEMO_PASSWORD },
  { id: 'u_sofia', login: 'sofia_v', systemRole: 'user', createdAt: '2026-09-04T12:10:00Z', password: DEMO_PASSWORD },
  { id: 'u_admin', login: 'admin', systemRole: 'admin', createdAt: '2026-08-25T07:00:00Z', password: DEMO_PASSWORD },
];
