import { useId } from 'react';
import { Logo } from '../../components/Logo';
import { AuthSwitch, type AuthMode } from '../../features/auth/AuthSwitch';
import { LoginForm } from '../../features/auth/LoginForm';
import { RegisterForm } from '../../features/auth/RegisterForm';
import styles from './AuthPage.module.css';

const TITLES: Record<AuthMode, string> = { login: 'Вход', register: 'Регистрация' };

export function AuthPage({ mode }: { mode: AuthMode }) {
  const headingId = useId();

  return (
    <main className={styles.page}>
      <title>{`${TITLES[mode]} — ConspectIsland`}</title>
      <Logo size="auth" />
      <section className={styles.card} aria-labelledby={headingId}>
        {/* Видимый заголовок дублировал бы переключатель — оставляем его для дикторов */}
        <h1 id={headingId} className="visually-hidden">
          {TITLES[mode]}
        </h1>
        <AuthSwitch mode={mode} />
        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
      </section>
    </main>
  );
}
