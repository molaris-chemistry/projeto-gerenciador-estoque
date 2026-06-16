export const BASE_URL = 'http://10.0.2.2:8080';

export const API_ENDPOINTS = {
  reagentes: `${BASE_URL}/api/reagentes`,
  reagenteById: (id: number) => `${BASE_URL}/api/reagentes/${id}`,
  reagentesSearch: (query: string) =>
    `${BASE_URL}/api/reagentes/search?q=${encodeURIComponent(query)}`,

  movimentacoes: `${BASE_URL}/api/movimentacoes`,
  movimentacaoById: (id: number) => `${BASE_URL}/api/movimentacoes/${id}`,

  materias: `${BASE_URL}/api/materias`,

  turmas: `${BASE_URL}/api/turmas`,
} as const;
