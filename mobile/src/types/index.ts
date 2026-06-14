// ─── Navigation ───────────────────────────────────────────────
export type RootStackParamList = {
  index: undefined;
  "(tabs)": undefined;
};

// ─── Domain ──────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  reason?: string;
  performedBy?: string;
  createdAt: Date;
}

// ─── Reagente ────────────────────────────────────────────────
export interface Reagente {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
}

// ─── Materia ────────────────────────────────────────────────
export interface Materia {
  id: number;
  nome: string;
}

// ─── Turma ──────────────────────────────────────────────────
export interface Turma {
  id: number;
  sala: string;
  nome: string;
}

// ─── Movimentacao ───────────────────────────────────────────
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
