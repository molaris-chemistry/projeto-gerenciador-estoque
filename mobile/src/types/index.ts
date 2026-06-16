export interface Reagente {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
  dataValidade?: string | null; // ISO date "YYYY-MM-DD"
  quantidadeMinima?: number | null;
}

export interface AlertasResponse {
  vencendo: Reagente[];
  estoqueMinimo: Reagente[];
}

export interface Materia {
  id: number;
  nome: string;
}

export interface Turma {
  id: number;
  sala: string;
  nome: string;
}

export interface Movimentacao {
  id: number;
  tipo: "ENTRADA" | "RETIRADA";
  reagenteId: number;
  quantidade: number;
  materiaId: number;
  turmaId: number;
  data: string;
  reagenteNome?: string;
  materia?: string;
  turma?: string;
  unidade?: string;
}

export interface MovimentacaoRequest {
  tipo: "ENTRADA" | "RETIRADA";
  reagenteId: number;
  quantidade: number;
  materiaId: number;
  turmaId: number;
}

export type RootTabParamList = {
  Tab1: undefined;
  Tab2: undefined;
  Tab3: undefined;
  Tab4: undefined;
  Tab5: undefined;
};

export type Tab2StackParamList = {
  Dashboard: undefined;
  Reagentes: undefined;
  ReagenteDetail: { reagenteId: number };
};
