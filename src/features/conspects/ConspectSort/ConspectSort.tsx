import { Select } from '../../../components/Select';
import { CONSPECT_SORT_OPTIONS, type ConspectSortKey } from '../sortConspects';

interface ConspectSortProps {
  value: ConspectSortKey;
  onChange: (value: ConspectSortKey) => void;
}

export function ConspectSort({ value, onChange }: ConspectSortProps) {
  return (
    <Select
      label="Сортировка"
      name="sort"
      options={CONSPECT_SORT_OPTIONS}
      value={value}
      onChange={(event) => onChange(event.target.value as ConspectSortKey)}
    />
  );
}
