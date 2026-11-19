import { describe, expect, it } from 'vitest';
import type { Conspect } from '../../types';
import { parseConspectSort, sortConspects } from './sortConspects';

const conspect = (name: string, createdAt: string) => ({ id: name, name, createdAt }) as Conspect;

const items = [
  conspect('Индексы', '2026-09-30T08:00:00Z'),
  conspect('ER-модели', '2026-09-02T08:00:00Z'),
  conspect('Нормальные формы', '2026-09-09T08:00:00Z'),
  conspect('Лекция 10', '2026-09-20T08:00:00Z'),
  conspect('Лекция 2', '2026-09-21T08:00:00Z'),
];

const names = (list: Conspect[]) => list.map((c) => c.name);

describe('sortConspects', () => {
  it('по дате: сначала новые и сначала старые', () => {
    expect(names(sortConspects(items, 'created-desc'))[0]).toBe('Индексы');
    expect(names(sortConspects(items, 'created-asc'))[0]).toBe('ER-модели');
  });

  it('по названию: русский порядок (кириллица раньше латиницы) и числа как числа', () => {
    expect(names(sortConspects(items, 'name-asc'))).toEqual([
      'Индексы',
      'Лекция 2',
      'Лекция 10',
      'Нормальные формы',
      'ER-модели',
    ]);
    expect(names(sortConspects(items, 'name-desc'))[0]).toBe('ER-модели');
  });

  it('не меняет исходный массив', () => {
    const copy = [...items];
    sortConspects(items, 'name-asc');
    expect(items).toEqual(copy);
  });
});

describe('parseConspectSort', () => {
  it('неизвестное значение заменяет сортировкой по умолчанию', () => {
    expect(parseConspectSort('name-asc')).toBe('name-asc');
    expect(parseConspectSort('oops')).toBe('created-desc');
    expect(parseConspectSort(null)).toBe('created-desc');
  });
});
