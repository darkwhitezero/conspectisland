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
