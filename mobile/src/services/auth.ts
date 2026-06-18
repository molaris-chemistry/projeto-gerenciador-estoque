import axios from 'axios';
import { BASE_URL } from './api';
import type { UserRole } from '@/types';

const AUTH_BASE = BASE_URL.replace('/api', '');

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}

export async function loginApi(email: string, password: string): Promise<AuthTokens> {
  const response = await axios.post<AuthTokens>(`${AUTH_BASE}/auth/login`, {
    email,
    password,
  });
  return response.data;
}

export async function registerApi(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  await axios.post(`${AUTH_BASE}/auth/cadastro`, { name, email, password });
}
