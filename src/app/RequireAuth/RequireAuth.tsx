import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '../../components/Spinner';
import { loginPathFor } from '../../utils/redirect';
import { useAuth } from '../AuthProvider';

/** Пропускает только вошедших; гостя отправляет на вход с возвратом обратно. */
export function RequireAuth() {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <Spinner page />;
  if (!user) return <Navigate to={loginPathFor(location.pathname + location.search)} replace />;
  return <Outlet />;
}
