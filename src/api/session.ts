import { ApiError } from './client';

// Сессия хранится в localStorage. Если хранилище недоступно (приватный
// режим, тесты), сессия держится в памяти до перезагрузки страницы.
const SESSION_KEY = 'conspectisland.session';
let memorySession: string | null = null;

export function readSession(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY) ?? memorySession;
  } catch {
    return memorySession;
  }
}

export function writeSession(userId: string): void {
  memorySession = userId;
  try {
    localStorage.setItem(SESSION_KEY, userId);
  } catch {
    // Остаётся сессия в памяти.
  }
}

export function clearSession(): void {
  memorySession = null;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Нечего очищать.
  }
}

/** id вошедшего пользователя; без сессии — ошибка, как 401 у сервера. */
export function requireUserId(): string {
  const userId = readSession();
  if (!userId) throw new ApiError('unauthorized', 'Войдите, чтобы продолжить');
  return userId;
}
