import api from "./api";
import type { AlertasResponse } from "@/types";

const EMPTY_ALERTAS: AlertasResponse = { vencendo: [], estoqueMinimo: [] };

export async function fetchAlertas(): Promise<AlertasResponse> {
  const response = await api.get<Partial<AlertasResponse>>("/reagentes/alertas");
  const data = response.data ?? {};
  return {
    vencendo: data.vencendo ?? [],
    estoqueMinimo: data.estoqueMinimo ?? [],
  };
}

export { EMPTY_ALERTAS };
