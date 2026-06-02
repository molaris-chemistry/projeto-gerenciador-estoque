import { api } from "./api.service";

export const produtoService = {
  listar: async () => {
    const response = await api.get("/produtos");
    return response.data;
  },
  buscar: async (id: number) => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },
  criar: async (data: any) => {
    const response = await api.post("/produtos", data);
    return response.data;
  },
  atualizar: async (id: number, data: any) => {
    const response = await api.put(`/produtos/${id}`, data);
    return response.data;
  },
  deletar: async (id: number) => {
    const response = await api.delete(`/produtos/${id}`);
    return response.data;
  }
};
