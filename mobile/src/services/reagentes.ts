import api from './api';
import type { AlertasResponse, Reagente } from '@/types';

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

export { EMPTY_ALERTAS };
