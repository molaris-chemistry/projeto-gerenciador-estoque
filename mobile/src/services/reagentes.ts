import api from './api';
import type { AlertasResponse, Reagente, ReagentePayload } from '@/types';

const EMPTY_ALERTAS: AlertasResponse = { vencendo: [], estoqueMinimo: [] };

export async function fetchAlertas(): Promise<AlertasResponse> {
  const response = await api.get<Partial<AlertasResponse>>('/reagentes/alertas');
  const data = response.data ?? {};
  return {
    vencendo: data.vencendo ?? [],
    estoqueMinimo: data.estoqueMinimo ?? [],
  };
}

export async function fetchReagenteById(id: number): Promise<Reagente> {
  const response = await api.get<Reagente>(`/reagentes/${id}`);
  return response.data;
}

export async function searchReagentes(q: string): Promise<Reagente[]> {
  const response = await api.get<Reagente[]>('/reagentes/search', { params: { q } });
  return response.data;
}

export async function createReagente(data: ReagentePayload): Promise<Reagente> {
  const response = await api.post<Reagente>('/reagentes', data);
  return response.data;
}

export async function updateReagente(
  id: number,
  data: ReagentePayload,
): Promise<Reagente> {
  const response = await api.put<Reagente>(`/reagentes/${id}`, data);
  return response.data;
}

export async function deleteReagente(id: number): Promise<void> {
  await api.delete(`/reagentes/${id}`);
}

export { EMPTY_ALERTAS };
