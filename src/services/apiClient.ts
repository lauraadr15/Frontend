import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { secureStorage } from "../storage/secureStorage";

const API_URL: string = process.env.EXPO_PUBLIC_API_URL ?? "";

// URL que realmente quedó grabada en la app (útil para diagnosticar conexión).
export const API_URL_EFECTIVA: string = API_URL !== "" ? API_URL : "(URL no definida)";

if (API_URL === "") {
  console.warn(
    "EXPO_PUBLIC_API_URL no está definida. Configúrala en .env (desarrollo) o en eas.json (build)."
  );
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await secureStorage.obtenerToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
