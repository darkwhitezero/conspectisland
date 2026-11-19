import type { User } from '../../../types';
import { formatDateTime } from '../../../utils/format';
import { SYSTEM_ROLE_LABELS } from '../../../utils/labels';
import styles from './AccountInfo.module.css';

/** Сведения об учётной записи: логин, дата регистрации, системная роль. */
export function AccountInfo({ user }: { user: User }) {
  return (
    <dl className={styles.list}>
      <div className={styles.item}>
        <dt>Логин</dt>
        <dd>{user.login}</dd>
      </div>
      <div className={styles.item}>
        <dt>Дата регистрации</dt>
        <dd>
          <time dateTime={user.createdAt}>{formatDateTime(user.createdAt)}</time>
        </dd>
      </div>
      <div className={styles.item}>
        <dt>Роль</dt>
        <dd>{SYSTEM_ROLE_LABELS[user.systemRole]}</dd>
      </div>
    </dl>
  );
}
