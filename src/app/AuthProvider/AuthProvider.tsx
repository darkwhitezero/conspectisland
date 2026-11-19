import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authApi from '../../api/auth';
import type { User } from '../../types';
import { AuthContext, type AuthContextValue } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthContextValue['status']>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [signedOut, setSignedOut] = useState(false);

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

  const signIn = useCallback((next: User) => {
    setUser(next);
    setSignedOut(false);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setSignedOut(true);
  }, []);

  const login = useCallback(
    async (loginValue: string, password: string) => signIn(await authApi.login(loginValue, password)),
    [signIn],
  );

  const register = useCallback(
    async (loginValue: string, password: string) => signIn(await authApi.register(loginValue, password)),
    [signIn],
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    signOut();
  }, [signOut]);

  const deleteAccount = useCallback(
    async (password: string) => {
      await authApi.deleteAccount(password);
      signOut();
    },
    [signOut],
  );

  const value = useMemo(
    () => ({ status, user, signedOut, login, register, logout, deleteAccount }),
    [status, user, signedOut, login, register, logout, deleteAccount],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
