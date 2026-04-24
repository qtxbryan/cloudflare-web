import { createContext, useContext, type ReactNode } from 'react';
import type { AuthContextValue, CFIdentity } from '../types/AuthTypes';

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const cfWindow = window as unknown as { __CF_IDENTITY__?: CFIdentity };
  const identity = cfWindow.__CF_IDENTITY__;

  const email =
    identity?.email ??
    (import.meta.env.VITE_USER_EMAIL as string | undefined) ??
    'user@company.com';
  const country =
    identity?.country ??
    (import.meta.env.VITE_USER_COUNTRY as string | undefined) ??
    'Unknown';
  const timestamp = identity?.timestamp ?? new Date().toISOString();

  const value: AuthContextValue = { email, country, timestamp };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
