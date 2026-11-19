import type { ProjectRole } from '../types';

// Права ролей в проекте (domain.md, раздел 3). Единственное место, где
// интерфейс решает, что показать: недоступное роли не рендерится вовсе.

export type ProjectAction =
  | 'viewConspects' // список, открытие конспекта, скачивание файлов
  | 'search' // поиск и ИИ-диалог
  | 'fork'
  | 'createConspect'
  | 'renameConspect'
  | 'editFiles' // добавить, заменить, удалить исходный файл
  | 'runStage' // запустить или перезапустить этап, видеть текст ошибки
  | 'deleteConspect'
  | 'renameProject'
  | 'deleteProject'
  | 'manageAccess' // политика доступа и участники
  | 'viewStats'
  | 'leaveProject';

const READER: ProjectAction[] = ['viewConspects', 'search', 'fork', 'leaveProject'];
const EDITOR: ProjectAction[] = [...READER, 'createConspect', 'renameConspect', 'editFiles', 'runStage'];
const OWNER: ProjectAction[] = [
  ...EDITOR.filter((action) => action !== 'leaveProject'),
  'deleteConspect',
  'renameProject',
  'deleteProject',
  'manageAccess',
  'viewStats',
];

const PERMISSIONS: Record<ProjectRole, ReadonlySet<ProjectAction>> = {
  reader: new Set(READER),
  editor: new Set(EDITOR),
  owner: new Set(OWNER),
};

export function can(role: ProjectRole, action: ProjectAction): boolean {
  return PERMISSIONS[role].has(action);
}
