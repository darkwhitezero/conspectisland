import { Button } from '../../../components/Button';
import { Select } from '../../../components/Select';
import type { ProjectMember } from '../../../types';
import { formatDateTime } from '../../../utils/format';
import { PROJECT_ROLE_LABELS } from '../../../utils/labels';
import styles from './MemberRow.module.css';

const ROLE_OPTIONS: { value: ProjectMember['role']; label: string }[] = [
  { value: 'editor', label: PROJECT_ROLE_LABELS.editor },
  { value: 'reader', label: PROJECT_ROLE_LABELS.reader },
];

interface MemberRowProps {
  member: ProjectMember;
  /** Идёт сохранение роли этого участника */
  saving: boolean;
  onRoleChange: (role: ProjectMember['role']) => void;
  onRemove: () => void;
}

export function MemberRow({ member, saving, onRoleChange, onRemove }: MemberRowProps) {
  return (
    <li className={styles.row}>
      <div className={styles.info}>
        <span className={styles.login}>{member.login}</span>
        <span className={styles.joined}>
          В проекте с <time dateTime={member.joinedAt}>{formatDateTime(member.joinedAt)}</time>
        </span>
      </div>
      <div className={styles.actions}>
        <Select
          label={`Роль участника ${member.login}`}
          hideLabel
          options={ROLE_OPTIONS}
          value={member.role}
          disabled={saving}
          onChange={(event) => onRoleChange(event.target.value as ProjectMember['role'])}
        />
        <Button variant="ghost" size="sm" onClick={onRemove} aria-label={`Исключить ${member.login}`}>
          Исключить
        </Button>
      </div>
    </li>
  );
}
