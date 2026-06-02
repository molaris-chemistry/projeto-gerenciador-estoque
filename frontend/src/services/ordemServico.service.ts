import { api } from "./api.service";

export const ordemServicoService = {
  listar: async () => {
    const response = await api.get("/ordens-servico");
    return response.data;
  },
  listarMinhas: async () => {
    const response = await api.get("/ordens-servico/minhas");
    return response.data;
  },
  solicitarAlocacao: async (data: any) => {
    const response = await api.post("/ordens-servico/alocar", data);
    return response.data;
  },
  aprovar: async (id: number) => {
    const response = await api.post(`/ordens-servico/${id}/aprovar`);
    return response.data;
  },
  concluir: async (id: number) => {
    const response = await api.post(`/ordens-servico/${id}/concluir`);
    return response.data;
  },
  receberDevolucao: async (id: number) => {
    const response = await api.post(`/ordens-servico/${id}/receber-devolucao`);
    return response.data;
  }
};
