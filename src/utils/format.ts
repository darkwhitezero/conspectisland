// Форматирование значений для показа в интерфейсе.

/**
 * Дата и время в формате «ДД.ММ.ГГГГ ЧЧ:ММ» в часовом поясе устройства
 * (domain.md, раздел 1). На вход — строка ISO 8601 из API.
 */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  // Битая дата не должна превращаться в «NaN.NaN.NaN» на экране.
  if (Number.isNaN(date.getTime())) return '—';
  const pad = (value: number) => String(value).padStart(2, '0');
  const day = `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
  return `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const sizeNumber = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });

/** Размер файла: «512 Б», «340 КБ», «1,2 МБ» (1 КБ = 1024 Б). */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${sizeNumber.format(bytes / (1024 * 1024))} МБ`;
}
