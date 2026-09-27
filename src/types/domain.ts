export type Rol = "PASAJERO" | "CONDUCTOR" | "ADMINISTRADOR";

export interface Usuario {
  nombre: string;
  correo: string;
  rol: Rol;
}
