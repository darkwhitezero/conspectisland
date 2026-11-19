import { useId, useState } from 'react';
import { useAuth } from '../../app/AuthProvider';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { PageHeader } from '../../components/PageHeader';
import { AccountInfo } from '../../features/account/AccountInfo';
import { ChangePasswordForm } from '../../features/account/ChangePasswordForm';
import { DeleteAccountDialog } from '../../features/account/DeleteAccountDialog';
import styles from './AccountPage.module.css';

export function AccountPage() {
  const { user, logout } = useAuth();
  const ids = { info: useId(), password: useId(), danger: useId() };
  // Счётчик смен пароля: новый key сбрасывает форму после успеха.
  const [passwordChanges, setPasswordChanges] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!user) return null;

  return (
    <div className={styles.page}>
      <title>Учётная запись — ConspectIsland</title>
      <PageHeader
        title="Учётная запись"
        actions={
          <Button variant="secondary" onClick={logout}>
            Выйти
          </Button>
        }
      />

      <section className={styles.card} aria-labelledby={ids.info}>
        <h2 id={ids.info} className={styles.title}>
          Сведения
        </h2>
        <AccountInfo user={user} />
      </section>

      <section className={styles.card} aria-labelledby={ids.password}>
        <h2 id={ids.password} className={styles.title}>
          Смена пароля
        </h2>
        {passwordChanges > 0 && <Alert tone="info">Пароль изменён</Alert>}
        <ChangePasswordForm key={passwordChanges} onChanged={() => setPasswordChanges((count) => count + 1)} />
      </section>

      <section className={`${styles.card} ${styles.danger}`} aria-labelledby={ids.danger}>
        <h2 id={ids.danger} className={styles.title}>
          Удаление учётной записи
        </h2>
        <p className={styles.text}>
          Вместе с учётной записью удалятся все проекты, где вы — владелец, с их конспектами и файлами.
        </p>
        <Button variant="danger" className={styles.action} onClick={() => setDeleteOpen(true)}>
          Удалить учётную запись
        </Button>
      </section>

      <DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </div>
  );
}
