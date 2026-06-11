import axios from 'axios';

// Base URL do backend — ajustar conforme ambiente
// Em desenvolvimento: usar IP da máquina (não localhost) para dispositivo físico
const BASE_URL = __DEV__
  ? 'http://192.168.1.100:3000/api'
  : 'https://api.molaris.com.br/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor para log em dev
api.interceptors.request.use(
  (config) => {
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
    return Promise.reject(error);
  },
);

export default api;
