import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { setAuthToken, setOnUnauthorized } from '@/services/api';
import { loginApi, type AuthTokens } from '@/services/auth';

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
    getTokenAsync(TOKEN_KEY)
      .then((token) => applyToken(token))
      .finally(() => setIsLoading(false));
  }, [applyToken]);

  useEffect(() => {
    setOnUnauthorized(() => {
      deleteTokenAsync(TOKEN_KEY).catch(() => { });
      applyToken(null);
    });
  }, [applyToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      const tokens: AuthTokens = await loginApi(email, password);
      await setTokenAsync(TOKEN_KEY, tokens.accessToken);
      applyToken(tokens.accessToken);
    },
    [applyToken],
  );

  const logout = useCallback(async () => {
    await deleteTokenAsync(TOKEN_KEY);
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
