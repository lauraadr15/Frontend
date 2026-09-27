import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { secureStorage } from "../storage/secureStorage";

const API_URL: string | undefined = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  // Falla rápido y claro en vez de apuntar silenciosamente a localhost.
  console.warn(
    "EXPO_PUBLIC_API_URL no está definida. Configura tu archivo .env (ver .env.example)."
  );
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL ?? "http://localhost:8080",
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
