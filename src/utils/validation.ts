// Клиентская валидация (domain.md, раздел 5).
// Каждый валидатор возвращает текст ошибки для показа под полем или null.
import type { MimeType } from '../types';

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

/** Исходный файл (domain.md, раздел 5) */
export const SOURCE_FILE_RULES = {
  maxBytes: 10 * 1024 * 1024,
  /** Для атрибута accept у поля выбора файла */
  accept: '.txt,.md,.png,.jpg,.jpeg',
} as const;

const MIME_BY_EXTENSION: Record<string, MimeType> = {
  txt: 'text/plain',
  md: 'text/markdown',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};

/** Тип файла по расширению; null — формат не поддерживается. */
export function mimeTypeOf(fileName: string): MimeType | null {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  return fileName.includes('.') ? (MIME_BY_EXTENSION[extension] ?? null) : null;
}

/**
 * Проверка исходного файла перед загрузкой. Возвращает причину
 * отклонения (её показывают вместе с именем файла) или null.
 */
export async function validateSourceFile(file: File): Promise<string | null> {
  const mimeType = mimeTypeOf(file.name);
  if (!mimeType) return 'неподдерживаемый формат — можно TXT, MD, PNG или JPG';
  if (file.size === 0) return 'файл пустой';
  if (file.size > SOURCE_FILE_RULES.maxBytes) return 'файл больше 10 МБ';
  if (mimeType.startsWith('text/')) {
    try {
      // fatal: true — любая последовательность не в UTF-8 вызывает ошибку
      new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer());
    } catch {
      return 'текст не в кодировке UTF-8';
    }
  }
  return null;
}
