import { AxiosError } from "axios";
import { API_URL_EFECTIVA } from "./apiClient";
import { ErrorResponse } from "../types/dto";

/** Convierte un error de axios en un mensaje legible para el usuario. */
export function extraerMensajeError(error: unknown): string {
  const axiosError = error as AxiosError<ErrorResponse>;

  if (axiosError.response) {
    return axiosError.response.data?.mensaje ?? `Error del servidor (${axiosError.response.status})`;
  }

  // Sin respuesta: el celular no llegó al backend.
  return `No se pudo conectar con ${API_URL_EFECTIVA} (${axiosError.code ?? "sin código"})`;
}
