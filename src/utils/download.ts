/** Отдать пользователю файл: временная ссылка с атрибутом download. */
export function saveBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  // Даём браузеру начать скачивание, затем освобождаем память.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
