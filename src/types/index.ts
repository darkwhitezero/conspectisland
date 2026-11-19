// Сущности предметной области (domain.md, раздел 4).

export type SystemRole = 'user' | 'admin';
export type ProjectRole = 'owner' | 'editor' | 'reader';
export type AccessPolicy = 'PRIVATE' | 'LINK';
export type StageType = 'ocr' | 'render' | 'index';
export type StageStatus = 'not_requested' | 'queued' | 'running' | 'done' | 'failed';
export type MimeType = 'text/plain' | 'text/markdown' | 'image/png' | 'image/jpeg';

export interface User {
  id: string;
  login: string;
  systemRole: SystemRole;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  accessPolicy: AccessPolicy;
  createdAt: string;
  /** Роль текущего пользователя */
  myRole: ProjectRole;
  /** Есть только при LINK и только у владельца */
  inviteLink?: string;
}

export interface ProjectMember {
  userId: string;
  login: string;
  role: 'editor' | 'reader';
  joinedAt: string;
}

export interface ProcessingStage {
  type: StageType;
  status: StageStatus;
  errorMessage?: string;
}

export interface Conspect {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  /** Растёт на 1 при каждом изменении файлов */
  sourceRevision: number;
  /** Всегда три элемента */
  stages: ProcessingStage[];
  hasHtml: boolean;
  /** Файлы изменены, новое HTML ещё не готово */
  htmlOutdated: boolean;
}

export interface ConspectFile {
  id: string;
  conspectId: string;
  /** С 1, порядок загрузки */
  position: number;
  fileName: string;
  mimeType: MimeType;
  sizeBytes: number;
  /** Есть у файла распознанного текста */
  ocrSourceFileId?: string;
}
