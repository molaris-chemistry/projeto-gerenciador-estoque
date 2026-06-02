import { api } from "./api.service";

export const usuarioService = {
  listar: async () => {
    const response = await api.get("/usuarios");
    return response.data;
  },
  criar: async (data: any) => {
    const response = await api.post("/usuarios", data);
    return response.data;
  },
  atualizar: async (id: number, data: any) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },
  deletar: async (id: number) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  }
};
