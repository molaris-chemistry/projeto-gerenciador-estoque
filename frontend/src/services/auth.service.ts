import { api } from "./api.service";

export const authService = {
  login: async (credentials: any) => {
    // Note: This endpoint is /auth/login based on backend
    const response = await api.post("/../auth/login", credentials);
    return response.data;
  }
};
