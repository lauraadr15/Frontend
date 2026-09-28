import { apiClient } from "./apiClient";
import { extraerMensajeError } from "./errores";
import { DashboardResponse } from "../types/dto";

export const dashboardService = {
  async obtenerResumen(): Promise<DashboardResponse> {
    try {
      const respuesta = await apiClient.get<DashboardResponse>("/api/dashboard");
      return respuesta.data;
    } catch (error) {
      throw new Error(extraerMensajeError(error));
    }
  },
};
