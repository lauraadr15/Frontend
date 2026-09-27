import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import { DashboardResponse, ErrorResponse } from "../types/dto";

export const dashboardService = {
  async obtenerResumen(): Promise<DashboardResponse> {
    try {
      const respuesta = await apiClient.get<DashboardResponse>("/api/dashboard");
      return respuesta.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.mensaje ?? "No se pudo cargar el dashboard");
    }
  },
};
