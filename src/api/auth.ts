import { createId, db, type UserRecord } from '../mocks/db';
import type { User } from '../types';
import { MESSAGES } from '../utils/labels';
import { ApiError, delay } from './client';
import { clearSession, readSession, writeSession } from './session';

/** Публичная часть записи: пароль за пределы мок-БД не уходит. */
function toUser(record: UserRecord): User {
  return { id: record.id, login: record.login, systemRole: record.systemRole, createdAt: record.createdAt };
}

/** Логины сравниваются без учёта регистра (domain.md, раздел 5). */
function findByLogin(login: string): UserRecord | undefined {
  const needle = login.toLowerCase();
  return db.users.find((user) => user.login.toLowerCase() === needle);
}

export async function login(loginValue: string, password: string): Promise<User> {
  await delay();
  const user = findByLogin(loginValue);
  if (!user || user.password !== password) {
    throw new ApiError('invalid_credentials', MESSAGES.invalidCredentials);
  }
  writeSession(user.id);
  return toUser(user);
}

/** Регистрирует пользователя и сразу открывает для него сессию. */
export async function register(loginValue: string, password: string): Promise<User> {
  await delay();
  if (findByLogin(loginValue)) {
    throw new ApiError('login_taken', MESSAGES.loginTaken);
  }
  const user: UserRecord = {
    id: createId('u'),
    login: loginValue,
    systemRole: 'user',
    createdAt: new Date().toISOString(),
    password,
  };
  db.users.push(user);
  writeSession(user.id);
  return toUser(user);
}

export async function logout(): Promise<void> {
  await delay();
  clearSession();
}

/** Текущий пользователь по сохранённой сессии или null. */
export async function getCurrentUser(): Promise<User | null> {
  await delay();
  const userId = readSession();
  if (!userId) return null;
  const user = db.users.find((candidate) => candidate.id === userId);
  if (!user) {
    clearSession();
    return null;
  }
  return toUser(user);
}

function requireCurrentUser(): UserRecord {
  const user = db.users.find((candidate) => candidate.id === readSession());
  if (!user) throw new ApiError('unauthorized', 'Войдите, чтобы продолжить');
  return user;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await delay();
  const user = requireCurrentUser();
  if (user.password !== currentPassword) {
    throw new ApiError('invalid_password', MESSAGES.invalidCurrentPassword);
  }
  user.password = newPassword;
}

/**
 * Удаляет учётную запись. Проекты, где пользователь — владелец, удаляются
 * целиком (с конспектами, файлами и участниками); из чужих он выходит.
 */
export async function deleteAccount(password: string): Promise<void> {
  await delay();
  const user = requireCurrentUser();
  if (user.password !== password) {
    throw new ApiError('invalid_password', MESSAGES.invalidPassword);
  }
  const ownedProjects = new Set(db.projects.filter((p) => p.ownerId === user.id).map((p) => p.id));
  const ownedConspects = new Set(db.conspects.filter((c) => ownedProjects.has(c.projectId)).map((c) => c.id));
  db.projects = db.projects.filter((p) => !ownedProjects.has(p.id));
  db.conspects = db.conspects.filter((c) => !ownedConspects.has(c.id));
  db.files = db.files.filter((f) => !ownedConspects.has(f.conspectId));
  ownedConspects.forEach((id) => {
    delete db.html[id];
    delete db.stageTimers[id];
  });
  db.memberships = db.memberships.filter((m) => m.userId !== user.id && !ownedProjects.has(m.projectId));
  db.users = db.users.filter((u) => u.id !== user.id);
  clearSession();
}
