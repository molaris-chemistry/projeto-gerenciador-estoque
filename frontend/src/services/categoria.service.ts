import { api } from "./api.service";

export const categoriaService = {
  listar: async () => {
    const response = await api.get("/categorias");
    return response.data;
  },
  criar: async (data: any) => {
    const response = await api.post("/categorias", data);
    return response.data;
  },
  atualizar: async (id: number, data: any) => {
    const response = await api.put(`/categorias/${id}`, data);
    return response.data;
  },
  deletar: async (id: number) => {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  }
};
