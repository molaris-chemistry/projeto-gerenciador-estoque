import api from "./api";
import type {
  Movimentacao,
  MovimentacaoRequest,
  Reagente,
  Materia,
  Turma,
} from "@/types";

/**
 * Busca todas as movimentações
 */
export async function fetchMovimentacoes(): Promise<Movimentacao[]> {
  const response = await api.get("/movimentacoes");
  return response.data;
}

/**
 * Busca movimentações filtradas por tipo
 */
export async function fetchMovimentacoesByTipo(
  tipo: "ENTRADA" | "RETIRADA",
): Promise<Movimentacao[]> {
  const response = await api.get(`/movimentacoes?tipo=${tipo}`);
  return response.data;
}

/**
 * Cria uma nova movimentação
 */
export async function createMovimentacao(
  data: MovimentacaoRequest,
): Promise<Movimentacao> {
  const response = await api.post("/movimentacoes", data);
  return response.data;
}

/**
 * Busca todos os reagentes para o picker
 */
export async function fetchReagentes(): Promise<Reagente[]> {
  const response = await api.get("/reagentes");
  return response.data;
}

/**
 * Busca todas as matérias para o picker
 */
export async function fetchMaterias(): Promise<Materia[]> {
  const response = await api.get("/materias");
  return response.data;
}

/**
 * Busca todas as turmas para o picker
 */
export async function fetchTurmas(): Promise<Turma[]> {
  const response = await api.get("/turmas");
  return response.data;
}
