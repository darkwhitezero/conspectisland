import { createContext } from 'react';
import type { User } from '../../types';

export interface AuthContextValue {
  /** 'loading' — пока проверяем сохранённую сессию. */
  status: 'loading' | 'ready';
  user: User | null;
  login: (login: string, password: string) => Promise<void>;
  register: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
