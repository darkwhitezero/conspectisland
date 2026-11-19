export const DEFAULT_AFTER_LOGIN = '/projects';

/**
 * Возвращает безопасный путь для перехода после входа.
 * Принимаются только внутренние пути: «//evil.com» и полные URL
 * отбрасываются, чтобы ?redirect= нельзя было использовать для фишинга.
 */
export function safeRedirect(target: string | null): string {
  if (!target || !target.startsWith('/') || target.startsWith('//') || target.startsWith('/\\')) {
    return DEFAULT_AFTER_LOGIN;
  }
  return target;
}

export function loginPathFor(currentPath: string): string {
  return `/login?redirect=${encodeURIComponent(currentPath)}`;
}
