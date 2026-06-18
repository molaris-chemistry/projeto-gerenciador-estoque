import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { setAuthToken, setOnUnauthorized } from '@/services/api';
import { loginApi } from '@/services/auth';
import { fetchCurrentUser } from '@/services/users';
import type { User, UserRole } from '@/types';

const TOKEN_KEY = 'molaris_access_token';

const setTokenAsync = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getTokenAsync = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const deleteTokenAsync = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const loadProfile = useCallback(async () => {
    const profile = await fetchCurrentUser();
    setUser(profile);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await getTokenAsync(TOKEN_KEY);
        if (!token) {
          clearSession();
          return;
        }

        setAuthToken(token);
        await loadProfile();
      } catch {
        await deleteTokenAsync(TOKEN_KEY);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [clearSession, loadProfile]);

  useEffect(() => {
    setOnUnauthorized(() => {
      deleteTokenAsync(TOKEN_KEY).catch(() => {});
      clearSession();
    });
  }, [clearSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const tokens = await loginApi(email, password);
      await setTokenAsync(TOKEN_KEY, tokens.accessToken);
      setAuthToken(tokens.accessToken);
      await loadProfile();
    },
    [loadProfile],
  );

  const logout = useCallback(async () => {
    await deleteTokenAsync(TOKEN_KEY);
    clearSession();
  }, [clearSession]);

  const role = user?.role ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      isAuthenticated,
      isLoading,
      isAdmin: role === 'TECNICO',
      isTeacher: role === 'PROFESSOR',
      login,
      logout,
    }),
    [user, role, isAuthenticated, isLoading, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
