import axios from 'axios';
import { Platform } from 'react-native';

function getDevBaseUrl(): string {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api';
  }
  return 'http://localhost:8080/api';
}

export const BASE_URL = __DEV__
  ? getDevBaseUrl()
  : 'https://api.molaris.com.br/api';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      if (error.code === 'ERR_NETWORK') {
        return 'Falha de conexão com o servidor. Verifique se o backend está rodando.';
      }
      return fallback;
    }
    if (error.response.status === 403) {
      return 'Você não tem permissão para esta ação.';
    }
    const data = error.response?.data;
    if (typeof data === 'string' && data.trim().length > 0) {
      return data;
    }
    if (data && typeof data === 'object') {
      const message = (data as { message?: string; error?: string }).message
        ?? (data as { message?: string; error?: string }).error;
      if (message) return message;
    }
  }
  return fallback;
}

let _token: string | null = null;
let _onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null): void {
  _token = token;
}

export function getAuthToken(): string | null {
  return _token;
}

export function setOnUnauthorized(handler: () => void): void {
  _onUnauthorized = handler;
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (_token) {
      config.headers.Authorization = `Bearer ${_token}`;
    }
    if (__DEV__) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (__DEV__) {
      console.error(
        '[API Error]',
        error.response?.status ?? error.code,
        error.response?.data ?? error.message,
      );
    }
    if (error.response?.status === 401) {
      _onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export default api;
