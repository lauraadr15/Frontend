import { apiClient } from "./apiClient";
import { extraerMensajeError } from "./errores";
import {
  LoginRequest,
  LoginResponse,
  RegistroRequest,
  RegistroResponse,
} from "../types/dto";

export const authService = {
  async registrar(datos: RegistroRequest): Promise<RegistroResponse> {
    try {
      const respuesta = await apiClient.post<RegistroResponse>("/api/auth/registro", datos);
      return respuesta.data;
    } catch (error) {
      throw new Error(extraerMensajeError(error));
    }
  },

  async login(datos: LoginRequest): Promise<LoginResponse> {
    try {
      const respuesta = await apiClient.post<LoginResponse>("/api/auth/login", datos);
      return respuesta.data;
    } catch (error) {
      throw new Error(extraerMensajeError(error));
    }
  },
};
