import api, { BASE_URL } from './api';
import type { User } from '@/types';

const ROOT_BASE = BASE_URL.replace('/api', '');

export async function fetchCurrentUser(): Promise<User> {
  const response = await api.get<User>(`${ROOT_BASE}/me`);
  return response.data;
}
