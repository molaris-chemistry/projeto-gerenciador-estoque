import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  EMPTY_ALERTAS,
  fetchDashboardMovimentacoes,
  fetchDashboardReagentes,
} from "@/services/dashboard";
import { isExpiringSoon, isLowStock } from "@/utils/formatters";
import type { AlertasResponse, Reagente } from "@/types";

interface DashboardContextValue {
  totalReagentes: number;
  movimentacoesHoje: number;
  alertas: AlertasResponse;
  totalAlertas: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(
  undefined,
);

function buildAlertas(reagentes: Reagente[]): AlertasResponse {
  const estoqueMinimo = reagentes.filter((r) =>
    isLowStock(r.quantidade, r.quantidadeMinima ?? undefined),
  );
  const vencendo = reagentes.filter((r) =>
    isExpiringSoon(r.dataValidade),
  );
  return { vencendo, estoqueMinimo };
}

function isSameLocalDay(iso: string, ref: Date): boolean {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [totalReagentes, setTotalReagentes] = useState(0);
  const [movimentacoesHoje, setMovimentacoesHoje] = useState(0);
  const [alertas, setAlertas] = useState<AlertasResponse>(EMPTY_ALERTAS);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (mode: "initial" | "refresh") => {
    if (mode === "refresh") setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    const [reagentesRes, movimentacoesRes] = await Promise.allSettled([
      fetchDashboardReagentes(),
      fetchDashboardMovimentacoes(),
    ]);

    let hadError = false;

    if (reagentesRes.status === "fulfilled") {
      setTotalReagentes(reagentesRes.value.length);
      setAlertas(buildAlertas(reagentesRes.value));
    } else {
      hadError = true;
      console.error("Erro ao carregar reagentes:", reagentesRes.reason);
    }

    if (movimentacoesRes.status === "fulfilled") {
      const hoje = new Date();
      const qtdHoje = movimentacoesRes.value.filter(
        (m) => m.data && isSameLocalDay(m.data, hoje),
      ).length;
      setMovimentacoesHoje(qtdHoje);
    } else {
      hadError = true;
      console.error("Erro ao carregar movimentações:", movimentacoesRes.reason);
    }

    if (hadError) {
      setError("Não foi possível carregar todos os dados");
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    load("initial");
  }, [load]);

  const refresh = useCallback(() => load("refresh"), [load]);

  const value = useMemo<DashboardContextValue>(
    () => ({
      totalReagentes,
      movimentacoesHoje,
      alertas,
      totalAlertas: alertas.vencendo.length + alertas.estoqueMinimo.length,
      isLoading,
      isRefreshing,
      error,
      refresh,
    }),
    [
      totalReagentes,
      movimentacoesHoje,
      alertas,
      isLoading,
      isRefreshing,
      error,
      refresh,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard deve ser usado dentro de DashboardProvider");
  }
  return ctx;
}
