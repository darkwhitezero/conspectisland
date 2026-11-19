import { useAuth } from '../../app/AuthProvider';
import { Button } from '../../components/Button';
import styles from './ProjectsPage.module.css';

// Временная страница: полноценный список проектов и layout — этап 2.
export function ProjectsPage() {
  const { user, logout } = useAuth();

  return (
    <main className={styles.page}>
      <title>Мои проекты — ConspectIsland</title>
      <h1>Мои проекты</h1>
      <p>Вы вошли как {user?.login}.</p>
      <Button variant="secondary" onClick={logout}>
        Выйти
      </Button>
    </main>
  );
}
