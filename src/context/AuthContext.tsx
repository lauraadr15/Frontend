import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { secureStorage } from "../storage/secureStorage";
import { authService } from "../services/authService";
import { LoginRequest, RegistroRequest } from "../types/dto";

interface AuthContextValue {
  estaAutenticado: boolean;
  cargandoSesion: boolean;
  iniciarSesion: (datos: LoginRequest) => Promise<void>;
  registrarse: (datos: RegistroRequest) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const [estaAutenticado, setEstaAutenticado] = useState<boolean>(false);
  const [cargandoSesion, setCargandoSesion] = useState<boolean>(true);

  useEffect(() => {
    secureStorage
      .obtenerToken()
      .then((token) => setEstaAutenticado(token !== null))
      .finally(() => setCargandoSesion(false));
  }, []);

  async function iniciarSesion(datos: LoginRequest): Promise<void> {
    const respuesta = await authService.login(datos);
    await secureStorage.guardarToken(respuesta.token);
    setEstaAutenticado(true);
  }

  async function registrarse(datos: RegistroRequest): Promise<void> {
    await authService.registrar(datos);
    // Tras registrarse, el usuario inicia sesión con las mismas credenciales.
    await iniciarSesion({ correo: datos.correo, contrasena: datos.contrasena });
  }

  async function cerrarSesion(): Promise<void> {
    await secureStorage.eliminarToken();
    setEstaAutenticado(false);
  }

  const valor: AuthContextValue = {
    estaAutenticado,
    cargandoSesion,
    iniciarSesion,
    registrarse,
    cerrarSesion,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return contexto;
}
