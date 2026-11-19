// Имитация обработки конспекта на «сервере». Статус этапа вычисляется
// по времени постановки в очередь — без фоновых таймеров.
import type { Conspect, StageType } from '../types';
import { createId, db, type FileRecord } from './db';
import { htmlDocument } from './seed/html';

export const QUEUED_MS = 3000;
export const RUNNING_MS = 5000;

export function stageStatusAt(requestedAt: number, now: number): 'queued' | 'running' | 'done' {
  const elapsed = now - requestedAt;
  if (elapsed < QUEUED_MS) return 'queued';
  if (elapsed < QUEUED_MS + RUNNING_MS) return 'running';
  return 'done';
}

export function filesOf(conspectId: string): FileRecord[] {
  return db.files.filter((f) => f.conspectId === conspectId).sort((a, b) => a.position - b.position);
}

/** Позиции 1..N по текущему порядку. */
export function renumber(conspectId: string): void {
  filesOf(conspectId).forEach((file, index) => {
    file.position = index + 1;
  });
}

/** Поставить этапы в очередь (запуск, перезапуск, реакция на изменение файлов). */
export function queueStages(conspect: Conspect, types: StageType[], now = Date.now()): void {
  const timers = (db.stageTimers[conspect.id] ??= {});
  for (const stage of conspect.stages) {
    if (!types.includes(stage.type)) continue;
    stage.status = 'queued';
    delete stage.errorMessage;
    timers[stage.type] = now;
  }
}

/** Файлы изменены: ревизия растёт, HTML устаревает, этапы перезапускаются. */
export function onSourcesChanged(conspect: Conspect, { imageAdded }: { imageAdded: boolean }): void {
  const now = Date.now();
  conspect.sourceRevision += 1;
  conspect.updatedAt = new Date(now).toISOString();
  if (conspect.hasHtml) conspect.htmlOutdated = true;
  queueStages(conspect, imageAdded ? ['ocr', 'render', 'index'] : ['render', 'index'], now);
}

/** Догнать статусы этапов до текущего момента и применить итоги. */
export function syncProcessing(conspect: Conspect, now = Date.now()): void {
  const timers = db.stageTimers[conspect.id];
  if (!timers) return;
  for (const stage of conspect.stages) {
    const requestedAt = timers[stage.type];
    if (requestedAt === undefined) continue;
    stage.status = stageStatusAt(requestedAt, now);
    if (stage.status === 'done') {
      delete timers[stage.type];
      finishStage(conspect, stage.type);
    }
  }
}

function finishStage(conspect: Conspect, type: StageType): void {
  if (type === 'ocr') addRecognizedText(conspect.id);
  if (type === 'render') {
    db.html[conspect.id] = buildHtml(conspect);
    conspect.hasHtml = true;
    conspect.htmlOutdated = false;
  }
}

/** Каждому изображению без распознанного текста — TXT сразу после него. */
function addRecognizedText(conspectId: string): void {
  const files = filesOf(conspectId);
  for (const file of files) {
    if (!file.mimeType.startsWith('image/')) continue;
    if (files.some((f) => f.ocrSourceFileId === file.id)) continue;
    const text = `Текст, распознанный с изображения ${file.fileName}.\n`;
    db.files.push({
      id: createId('f'),
      conspectId,
      position: file.position + 0.5, // встанет сразу за изображением после renumber
      fileName: file.fileName.replace(/\.(png|jpe?g)$/i, '.txt'),
      mimeType: 'text/plain',
      sizeBytes: new TextEncoder().encode(text).length,
      ocrSourceFileId: file.id,
      text,
    });
  }
  renumber(conspectId);
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Убрать служебные символы Markdown: заголовки, выделение, маркеры списков. */
const plainText = (markdown: string) =>
  markdown
    .replace(/^#+\s*/gm, '')
    .replace(/(\*\*|__|\*|_)(.+?)\1/g, '$2')
    .replace(/^\s*[-*]\s+/gm, '• ');

/** «Ответ языковой модели»: текст всех текстовых файлов одним документом. */
function buildHtml(conspect: Conspect): string {
  const sections = filesOf(conspect.id)
    .filter((f) => f.text !== undefined)
    .map((f) => `<h2>${escapeHtml(f.fileName)}</h2><p>${escapeHtml(plainText(f.text ?? '')).replace(/\n/g, '<br>')}</p>`)
    .join('');
  return htmlDocument(escapeHtml(conspect.name), `<h1>${escapeHtml(conspect.name)}</h1>${sections}`);
}
