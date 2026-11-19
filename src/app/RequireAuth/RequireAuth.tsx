import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '../../components/Spinner';
import { loginPathFor } from '../../utils/redirect';
import { useAuth } from '../AuthProvider';

/**
 * Пропускает только вошедших. Гостя отправляет на вход с возвратом обратно
 * (?redirect=). Если же сессию завершил сам пользователь, возвращать
 * следующего вошедшего на его страницу незачем — просто на вход.
 */
export function RequireAuth() {
  const { status, user, signedOut } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <Spinner page />;
  if (!user) {
    return <Navigate to={signedOut ? '/login' : loginPathFor(location.pathname + location.search)} replace />;
  }
  return <Outlet />;
}
