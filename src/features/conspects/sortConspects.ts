import type { Conspect } from '../../types';

// Сортировка списка конспектов (ФТ-КНС-05): по дате создания или названию,
// в обе стороны. Значение хранится в адресе: ?sort=created-desc.

export type ConspectSortKey = 'created-desc' | 'created-asc' | 'name-asc' | 'name-desc';

export const CONSPECT_SORT_OPTIONS: { value: ConspectSortKey; label: string }[] = [
  { value: 'created-desc', label: 'Сначала новые' },
  { value: 'created-asc', label: 'Сначала старые' },
  { value: 'name-asc', label: 'По названию, А → Я' },
  { value: 'name-desc', label: 'По названию, Я → А' },
];

export const DEFAULT_CONSPECT_SORT: ConspectSortKey = 'created-desc';

export function parseConspectSort(value: string | null): ConspectSortKey {
  return CONSPECT_SORT_OPTIONS.some((option) => option.value === value)
    ? (value as ConspectSortKey)
    : DEFAULT_CONSPECT_SORT;
}

const byName = new Intl.Collator('ru', { sensitivity: 'base', numeric: true }).compare;

export function sortConspects(conspects: Conspect[], key: ConspectSortKey): Conspect[] {
  const [field, direction] = key.split('-') as ['created' | 'name', 'asc' | 'desc'];
  const sign = direction === 'asc' ? 1 : -1;
  return [...conspects].sort(
    (a, b) => sign * (field === 'name' ? byName(a.name, b.name) : a.createdAt.localeCompare(b.createdAt)),
  );
}
