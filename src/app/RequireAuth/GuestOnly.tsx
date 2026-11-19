import { Navigate, Outlet, useSearchParams } from 'react-router-dom';
import { Spinner } from '../../components/Spinner';
import { safeRedirect } from '../../utils/redirect';
import { useAuth } from '../AuthProvider';

/**
 * Экраны для гостей. Как только пользователь вошёл (или уже был в сессии),
 * уводит его на ?redirect= либо в «Мои проекты». Формы сами не навигируют —
 * переход происходит в одном месте.
 */
export function GuestOnly() {
  const { status, user } = useAuth();
  const [searchParams] = useSearchParams();

  if (status === 'loading') return <Spinner page />;
  if (user) return <Navigate to={safeRedirect(searchParams.get('redirect'))} replace />;
  return <Outlet />;
}
