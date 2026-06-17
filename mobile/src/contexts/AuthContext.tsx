import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken, setOnUnauthorized } from '@/services/api';
import { loginApi, type AuthTokens } from '@/services/auth';

const TOKEN_KEY = 'molaris_access_token';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const applyToken = useCallback((token: string | null) => {
    setAuthToken(token);
    setIsAuthenticated(token !== null);
  }, []);

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY)
      .then((token) => applyToken(token))
      .finally(() => setIsLoading(false));
  }, [applyToken]);

  useEffect(() => {
    setOnUnauthorized(() => {
      SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
      applyToken(null);
    });
  }, [applyToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      const tokens: AuthTokens = await loginApi(email, password);
      await SecureStore.setItemAsync(TOKEN_KEY, tokens.accessToken);
      applyToken(tokens.accessToken);
    },
    [applyToken],
  );

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    applyToken(null);
  }, [applyToken]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
