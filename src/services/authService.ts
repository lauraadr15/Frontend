import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import {
  LoginRequest,
  LoginResponse,
  RegistroRequest,
  RegistroResponse,
  ErrorResponse,
} from "../types/dto";

function extraerMensajeError(error: unknown): string {
  const axiosError = error as AxiosError<ErrorResponse>;
  return axiosError.response?.data?.mensaje ?? "No se pudo conectar con el servidor";
}

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
