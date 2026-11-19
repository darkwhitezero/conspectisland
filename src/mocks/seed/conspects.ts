import type { Conspect, ProcessingStage, StageStatus } from '../../types';

/** Три этапа в фиксированном порядке; ошибка — только у этапа со статусом failed. */
function stages(ocr: StageStatus, render: StageStatus, index: StageStatus, errorMessage?: string): ProcessingStage[] {
  const stage = (type: ProcessingStage['type'], status: StageStatus): ProcessingStage =>
    status === 'failed' && errorMessage ? { type, status, errorMessage } : { type, status };
  return [stage('ocr', ocr), stage('render', render), stage('index', index)];
}

export const seedConspects: Conspect[] = [
  // «Базы данных» — все варианты статусов
  {
    id: 'c_nf',
    projectId: 'p_db',
    name: 'Нормальные формы',
    createdAt: '2026-09-09T08:30:00Z',
    updatedAt: '2026-09-09T09:10:00Z',
    sourceRevision: 2,
    stages: stages('done', 'done', 'done'),
    hasHtml: true,
    htmlOutdated: false,
  },
  {
    id: 'c_tx',
    projectId: 'p_db',
    name: 'Транзакции и уровни изоляции',
    createdAt: '2026-09-16T08:30:00Z',
    updatedAt: '2026-09-16T10:00:00Z',
    sourceRevision: 1,
    stages: stages('not_requested', 'failed', 'done', 'ИИ-сервис не ответил'),
    hasHtml: false,
    htmlOutdated: false,
  },
  {
    id: 'c_join',
    projectId: 'p_db',
    name: 'SQL: соединения таблиц',
    createdAt: '2026-09-23T08:30:00Z',
    updatedAt: '2026-11-18T17:45:00Z',
    sourceRevision: 4,
    stages: stages('done', 'running', 'queued'),
    hasHtml: false,
    htmlOutdated: false,
  },
  {
    id: 'c_er',
    projectId: 'p_db',
    name: 'ER-модели',
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-11-19T07:20:00Z',
    sourceRevision: 3,
    stages: stages('not_requested', 'queued', 'done'),
    hasHtml: true,
    htmlOutdated: true,
  },
  {
    id: 'c_idx',
    projectId: 'p_db',
    name: 'Индексы',
    createdAt: '2026-09-30T08:30:00Z',
    updatedAt: '2026-09-30T08:35:00Z',
    sourceRevision: 1,
    stages: stages('not_requested', 'not_requested', 'not_requested'),
    hasHtml: false,
    htmlOutdated: false,
  },

  // «Неклассические логики» — роль редактора
  {
    id: 'c_modal',
    projectId: 'p_logic',
    name: 'Модальная логика: система K',
    createdAt: '2026-09-12T12:00:00Z',
    updatedAt: '2026-09-12T13:30:00Z',
    sourceRevision: 1,
    stages: stages('done', 'done', 'done'),
    hasHtml: true,
    htmlOutdated: false,
  },
  {
    id: 'c_intu',
    projectId: 'p_logic',
    name: 'Интуиционистская логика',
    createdAt: '2026-09-19T12:00:00Z',
    updatedAt: '2026-09-19T12:15:00Z',
    sourceRevision: 1,
    stages: stages('failed', 'not_requested', 'not_requested', 'ИИ-сервис не ответил'),
    hasHtml: false,
    htmlOutdated: false,
  },

  // «ЭВМ и периферийные устройства» — роль читателя
  {
    id: 'c_bus',
    projectId: 'p_evm',
    name: 'Системная шина и арбитраж',
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-09-15T09:40:00Z',
    sourceRevision: 1,
    stages: stages('not_requested', 'done', 'done'),
    hasHtml: true,
    htmlOutdated: false,
  },
  {
    id: 'c_io',
    projectId: 'p_evm',
    name: 'Контроллеры ввода-вывода',
    createdAt: '2026-09-29T09:00:00Z',
    updatedAt: '2026-09-29T09:20:00Z',
    sourceRevision: 1,
    stages: stages('done', 'failed', 'not_requested', 'ИИ-сервис не ответил'),
    hasHtml: false,
    htmlOutdated: false,
  },

  // Чужой закрытый проект
  {
    id: 'c_law',
    projectId: 'p_law',
    name: 'Федеральный закон № 149-ФЗ',
    createdAt: '2026-09-11T10:00:00Z',
    updatedAt: '2026-09-11T10:30:00Z',
    sourceRevision: 1,
    stages: stages('not_requested', 'done', 'done'),
    hasHtml: true,
    htmlOutdated: false,
  },
];
