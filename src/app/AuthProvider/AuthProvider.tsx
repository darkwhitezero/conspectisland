import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authApi from '../../api/auth';
import type { User } from '../../types';
import { AuthContext, type AuthContextValue } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthContextValue['status']>('loading');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;
    authApi.getCurrentUser().then((current) => {
      if (!active) return;
      setUser(current);
      setStatus('ready');
    });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (loginValue: string, password: string) => {
    setUser(await authApi.login(loginValue, password));
  }, []);

  const register = useCallback(async (loginValue: string, password: string) => {
    setUser(await authApi.register(loginValue, password));
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ status, user, login, register, logout }),
    [status, user, login, register, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
