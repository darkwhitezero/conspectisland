// Сессия хранится в localStorage. Доступ обёрнут в try/catch:
// в приватном режиме или в тестах хранилище может быть недоступно.
const SESSION_KEY = 'conspectisland.session';

export function readSession(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function writeSession(userId: string): void {
  try {
    localStorage.setItem(SESSION_KEY, userId);
  } catch {
    // Без хранилища сессия просто не переживёт перезагрузку.
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Нечего очищать.
  }
}
