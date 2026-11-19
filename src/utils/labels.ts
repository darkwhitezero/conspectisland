// Тексты интерфейса, которые domain.md требует дословно.
import type { ProjectRole, StageStatus, StageType } from '../types';

export const MESSAGES = {
  loginTaken: 'Этот логин уже занят',
  invalidCredentials: 'Неверный логин или пароль',
} as const;

export const PROJECT_ROLE_LABELS: Record<ProjectRole, string> = {
  owner: 'Владелец',
  editor: 'Редактор',
  reader: 'Читатель',
};

export const STAGE_LABELS: Record<StageType, string> = {
  ocr: 'Распознавание текста',
  render: 'HTML-представление',
  index: 'Индексация',
};

/** Порядок этапов в интерфейсе */
export const STAGE_ORDER: StageType[] = ['ocr', 'render', 'index'];

export const STAGE_STATUS_LABELS: Record<StageStatus, string> = {
  not_requested: 'Не запрашивалось',
  queued: 'В очереди',
  running: 'Выполняется',
  done: 'Готово',
  failed: 'Ошибка',
};

export const CONSENT_TEXT =
  'Администратор имеет доступ на чтение ко всем проектам. При обработке конспектов их содержимое передаётся внешним ИИ-сервисам';
