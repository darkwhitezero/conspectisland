import { createId, db, type FileRecord } from '../mocks/db';
import { filesOf, onSourcesChanged, renumber } from '../mocks/processing';
import type { ConspectFile, MimeType } from '../types';
import { mimeTypeOf } from '../utils/validation';
import { requireConspectAccess, requireFileAccess } from './access';
import { ApiError, delay } from './client';

export const LAST_FILE_MESSAGE = 'В конспекте должен остаться хотя бы один файл';

export type FileContent = { kind: 'text'; mimeType: MimeType; text: string } | { kind: 'image'; url: string };

/** Метаданные без содержимого — так файл отдаёт список. */
function toFile(record: FileRecord): ConspectFile {
  const file: ConspectFile = {
    id: record.id,
    conspectId: record.conspectId,
    position: record.position,
    fileName: record.fileName,
    mimeType: record.mimeType,
    sizeBytes: record.sizeBytes,
  };
  if (record.ocrSourceFileId) file.ocrSourceFileId = record.ocrSourceFileId;
  return file;
}

const isImage = (mimeType: string) => mimeType.startsWith('image/');

export async function listFiles(conspectId: string): Promise<ConspectFile[]> {
  await delay();
  requireConspectAccess(conspectId, 'viewConspects');
  return filesOf(conspectId).map(toFile);
}

export async function getFileContent(fileId: string): Promise<FileContent> {
  await delay();
  const { file } = requireFileAccess(fileId, 'viewConspects');
  return file.url !== undefined ? { kind: 'image', url: file.url } : { kind: 'text', mimeType: file.mimeType, text: file.text ?? '' };
}

/** Содержимое для «Скачать». */
export async function getFileBlob(fileId: string): Promise<Blob> {
  const content = await getFileContent(fileId);
  if (content.kind === 'text') return new Blob([content.text], { type: `${content.mimeType};charset=utf-8` });
  const response = await fetch(content.url);
  return response.blob();
}

export async function getHtml(conspectId: string): Promise<string> {
  await delay();
  requireConspectAccess(conspectId, 'viewConspects');
  const html = db.html[conspectId];
  if (!html) throw new ApiError('not_found', 'HTML-представление ещё не готово');
  return html;
}

/** Имитация передачи файла: прогресс 0 → 100 примерно за секунду. */
async function simulateUpload(onProgress: (percent: number) => void): Promise<void> {
  for (let percent = 0; percent <= 100; percent += 20) {
    onProgress(percent);
    await delay(200);
  }
}

async function readContent(file: File): Promise<Pick<FileRecord, 'text' | 'url'>> {
  return isImage(mimeTypeOf(file.name) ?? '') ? { url: URL.createObjectURL(file) } : { text: await file.text() };
}

/** Новый файл встаёт в конец списка. */
export async function uploadFile(conspectId: string, file: File, onProgress: (percent: number) => void): Promise<ConspectFile> {
  const { conspect } = requireConspectAccess(conspectId, 'editFiles');
  const mimeType = mimeTypeOf(file.name);
  if (!mimeType) throw new ApiError('forbidden', `${file.name}: неподдерживаемый формат`);
  await simulateUpload(onProgress);
  const record: FileRecord = {
    id: createId('f'),
    conspectId,
    position: filesOf(conspectId).length + 1,
    fileName: file.name,
    mimeType,
    sizeBytes: file.size,
    ...(await readContent(file)),
  };
  db.files.push(record);
  onSourcesChanged(conspect, { imageAdded: isImage(mimeType) });
  return toFile(record);
}

/** Удалить файл распознанного текста, полученный из этого изображения. */
function dropRecognizedText(imageId: string): void {
  db.files = db.files.filter((f) => f.ocrSourceFileId !== imageId);
}

/** Замена сохраняет место в списке; распознанный текст старого изображения удаляется. */
export async function replaceFile(fileId: string, file: File, onProgress: (percent: number) => void): Promise<ConspectFile> {
  const { file: record, conspect } = requireFileAccess(fileId, 'editFiles');
  const mimeType = mimeTypeOf(file.name);
  if (!mimeType) throw new ApiError('forbidden', `${file.name}: неподдерживаемый формат`);
  await simulateUpload(onProgress);
  dropRecognizedText(record.id);
  const { text, url } = await readContent(file);
  Object.assign(record, { fileName: file.name, mimeType, sizeBytes: file.size, text, url });
  if (text !== undefined) delete record.url;
  if (url !== undefined) delete record.text;
  renumber(conspect.id);
  onSourcesChanged(conspect, { imageAdded: isImage(mimeType) });
  return toFile(record);
}

/** Удаление изображения убирает и его распознанный текст. Последний файл удалить нельзя. */
export async function deleteFile(fileId: string): Promise<void> {
  await delay();
  const { file, conspect } = requireFileAccess(fileId, 'editFiles');
  const removed = new Set([file.id, ...db.files.filter((f) => f.ocrSourceFileId === file.id).map((f) => f.id)]);
  if (filesOf(conspect.id).every((f) => removed.has(f.id))) {
    throw new ApiError('forbidden', LAST_FILE_MESSAGE);
  }
  db.files = db.files.filter((f) => !removed.has(f.id));
  renumber(conspect.id);
  onSourcesChanged(conspect, { imageAdded: false });
}
