// Тексты интерфейса, которые domain.md требует дословно.
import type { ProjectRole } from '../types';

export const MESSAGES = {
  loginTaken: 'Этот логин уже занят',
  invalidCredentials: 'Неверный логин или пароль',
} as const;

export const PROJECT_ROLE_LABELS: Record<ProjectRole, string> = {
  owner: 'Владелец',
  editor: 'Редактор',
  reader: 'Читатель',
};

export const CONSENT_TEXT =
  'Администратор имеет доступ на чтение ко всем проектам. При обработке конспектов их содержимое передаётся внешним ИИ-сервисам';
