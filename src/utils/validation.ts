// Клиентская валидация (domain.md, раздел 5).
// Каждый валидатор возвращает текст ошибки для показа под полем или null.

export const LOGIN_RULES = {
  minLength: 3,
  maxLength: 32,
  /** Латинские буквы, цифры и подчёркивание */
  pattern: /^[A-Za-z0-9_]+$/,
} as const;

export const PASSWORD_RULES = { minLength: 8, maxLength: 64 } as const;

export function validateLogin(value: string): string | null {
  if (value.length === 0) return 'Введите логин';
  // Сначала символы: после их исправления длина может стать допустимой.
  if (!LOGIN_RULES.pattern.test(value)) {
    return 'Используйте только латинские буквы, цифры и знак _';
  }
  const { minLength, maxLength } = LOGIN_RULES;
  if (value.length < minLength || value.length > maxLength) {
    return `Логин должен содержать от ${minLength} до ${maxLength} символов`;
  }
  return null;
}

export function validatePassword(value: string): string | null {
  if (value.length === 0) return 'Введите пароль';
  const { minLength, maxLength } = PASSWORD_RULES;
  if (value.length < minLength || value.length > maxLength) {
    return `Пароль должен содержать от ${minLength} до ${maxLength} символов`;
  }
  return null;
}
