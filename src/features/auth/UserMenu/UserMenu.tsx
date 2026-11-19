import { useAuth } from '../../../app/AuthProvider';
import { Icon } from '../../../components/Icon';
import { Menu } from '../../../components/Menu';
import styles from './UserMenu.module.css';

/** Меню пользователя в шапке: логин, «Учётная запись», «Выйти». */
export function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <Menu
      triggerLabel={`Меню пользователя ${user.login}`}
      trigger={
        <>
          <span className={styles.avatar} aria-hidden="true">
            {user.login.charAt(0).toUpperCase()}
          </span>
          <span className={styles.login}>{user.login}</span>
          <Icon name="chevronDown" />
        </>
      }
      header={<span className={styles.headerLogin}>{user.login}</span>}
      items={[
        { label: 'Учётная запись', to: '/account' },
        { label: 'Выйти', onSelect: logout },
      ]}
    />
  );
}
