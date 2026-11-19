import { describe, expect, it } from 'vitest';
import { formatDateTime } from './format';

// Даты строятся в местном времени, поэтому тесты не зависят от пояса машины.
const local = (...parts: [number, number, number, number, number]) =>
  new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]).toISOString();

describe('formatDateTime', () => {
  it('дополняет нулями день, месяц, часы и минуты', () => {
    expect(formatDateTime(local(2026, 9, 1, 9, 5))).toBe('01.09.2026 09:05');
  });

  it('показывает время в 24-часовом формате', () => {
    expect(formatDateTime(local(2026, 12, 31, 23, 59))).toBe('31.12.2026 23:59');
  });

  it('полночь — это 00:00', () => {
    expect(formatDateTime(local(2027, 1, 15, 0, 0))).toBe('15.01.2027 00:00');
  });

  it('вместо битой даты показывает прочерк', () => {
    expect(formatDateTime('not-a-date')).toBe('—');
  });
});
