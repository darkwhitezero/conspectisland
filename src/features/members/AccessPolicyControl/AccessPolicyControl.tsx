import { SegmentedControl } from '../../../components/SegmentedControl';
import type { AccessPolicy } from '../../../types';
import { ACCESS_POLICY_LABELS } from '../../../utils/labels';
import styles from './AccessPolicyControl.module.css';

const OPTIONS: { value: AccessPolicy; label: string }[] = [
  { value: 'PRIVATE', label: ACCESS_POLICY_LABELS.PRIVATE },
  { value: 'LINK', label: ACCESS_POLICY_LABELS.LINK },
];

const HINTS: Record<AccessPolicy, string> = {
  PRIVATE: 'Проект видите только вы.',
  LINK: 'Присоединиться может любой, у кого есть ссылка-приглашение. Новый участник получает роль «Читатель».',
};

interface AccessPolicyControlProps {
  value: AccessPolicy;
  /** Смена политики; переход на «Только владелец» подтверждает вызывающий. */
  onChange: (policy: AccessPolicy) => void;
}

export function AccessPolicyControl({ value, onChange }: AccessPolicyControlProps) {
  return (
    <div className={styles.control}>
      <SegmentedControl label="Политика доступа" options={OPTIONS} value={value} onChange={onChange} />
      <p className={styles.hint}>{HINTS[value]}</p>
    </div>
  );
}
