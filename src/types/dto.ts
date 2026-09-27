import { Rol } from "./domain";

export interface RegistroRequest {
  nombre: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  rol: Rol;
}

export interface RegistroResponse {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
}

export interface DashboardResponse {
  nombre: string;
  correo: string;
  rol: Rol;
  mensajeBienvenida: string;
}

export interface ErrorResponse {
  status: number;
  mensaje: string;
  fecha: string;
}
