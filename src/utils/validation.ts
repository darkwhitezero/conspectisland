// Клиентская валидация (domain.md, раздел 5).
// Каждый валидатор возвращает текст ошибки для показа под полем или null.

export const LOGIN_RULES = {
  minLength: 3,
  maxLength: 32,
  /** Латинские буквы, цифры и подчёркивание */
  pattern: /^[A-Za-z0-9_]+$/,
} as const;

export const PASSWORD_RULES = { minLength: 8, maxLength: 64 } as const;

/** Название проекта и конспекта */
export const NAME_RULES = { minLength: 1, maxLength: 100 } as const;

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

/** Пробелы по краям не считаются: название из одних пробелов — пустое. */
export function validateName(value: string): string | null {
  const name = value.trim();
  if (name.length === 0) return 'Введите название';
  if (name.length > NAME_RULES.maxLength) {
    return `Название должно содержать от ${NAME_RULES.minLength} до ${NAME_RULES.maxLength} символов`;
  }
  return null;
}
