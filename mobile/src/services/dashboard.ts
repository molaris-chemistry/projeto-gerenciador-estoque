import api from './api';
import type { AlertasResponse, Movimentacao, Reagente } from '@/types';

export const EMPTY_ALERTAS: AlertasResponse = {
  vencendo: [],
  estoqueMinimo: [],
};

export async function fetchDashboardReagentes(): Promise<Reagente[]> {
  const response = await api.get<Reagente[]>('/reagentes');
  return response.data;
}

export async function fetchDashboardMovimentacoes(): Promise<Movimentacao[]> {
  const response = await api.get<Movimentacao[]>('/movimentacoes');
  return response.data;
}

export async function fetchDashboardAlertas(): Promise<AlertasResponse> {
  const response = await api.get<Partial<AlertasResponse>>('/reagentes/alertas');
  const data = response.data ?? {};
  return {
    vencendo: data.vencendo ?? [],
    estoqueMinimo: data.estoqueMinimo ?? [],
  };
}
