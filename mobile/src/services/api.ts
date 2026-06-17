import axios from 'axios';

export const BASE_URL = __DEV__
  ? 'http://localhost:8080/api'
  : 'https://api.molaris.com.br/api';

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
      console.error('[API Error]', error.response?.status, error.response?.data);
    }
    if (error.response?.status === 401) {
      _onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export default api;
