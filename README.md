# RideMove — App móvil (React Native + Expo + TypeScript)

## 1. Por qué React Native/Expo

Coincide con lo que ya está en el documento entregado (frontend con componentes tipados, sin
`any`) y sí produce una **app móvil real** (instalable en Android/iOS), que es justo lo que pidió
el profesor: nada de correr esto solo en localhost/navegador.

## 2. Instalar y correr

```bash
npm install
cp .env.example .env   # edita EXPO_PUBLIC_API_URL
npx expo start
```

Escanea el QR con **Expo Go** en tu celular, o abre un emulador Android/iOS desde la terminal
(`a` o `i` en la consola de Expo).

### ⚠️ Sobre `EXPO_PUBLIC_API_URL`

Tu celular físico **no puede resolver `localhost`** (ese `localhost` sería el propio celular, no
tu computador). Pasos:

1. Corre el backend (`mvn spring-boot:run`) en tu computador.
2. Averigua la IP local de tu computador (`ipconfig` en Windows, `ifconfig`/`ip a` en Mac/Linux),
   ej. `192.168.1.50`.
3. En `.env`: `EXPO_PUBLIC_API_URL=http://192.168.1.50:8080`.
4. Celular y computador deben estar en la **misma red WiFi**.

Para la entrega final (no solo la demo), lo ideal es desplegar el backend en un servidor/PaaS con
URL pública y apuntar `EXPO_PUBLIC_API_URL` a esa URL — así nunca dependen de estar en la misma red.

## 3. Estructura

```
src/
├── types/           # DTOs y modelos, idénticos a los del backend (Usuario, Rol, RegistroRequest...)
├── services/         # apiClient (axios + interceptor JWT), authService, dashboardService
├── storage/           # secureStorage: SecureStore, nunca AsyncStorage plano para el token
├── context/           # AuthContext: única fuente de verdad de la sesión
├── navigation/        # AppNavigator: stack de auth vs stack autenticado según el token
├── screens/            # LoginScreen, RegistroScreen, DashboardScreen
└── components/         # InputField, PrimaryButton (reutilizables, una sola responsabilidad)
```

## 4. Cómo cumple lo pedido

- **Tipado estricto, sin `any`**: `tsconfig.json` con `strict: true`; todos los DTOs y props de
  componentes están tipados explícitamente.
- **Componentes con una sola responsabilidad**: `InputField` solo renderiza un campo,
  `PrimaryButton` solo un botón con estado de carga, cada screen solo orquesta su propia pantalla.
- **Sin configuración quemada**: la URL del backend sale de `EXPO_PUBLIC_API_URL` (variable de
  entorno), nunca escrita directamente en el código.
- **JWT**: se guarda con `expo-secure-store` (cifrado en el dispositivo, no `AsyncStorage` plano)
  y se adjunta automáticamente a cada request vía interceptor de axios.
- **Las 3 funcionalidades**: `RegistroScreen` → `POST /api/auth/registro`,
  `LoginScreen` → `POST /api/auth/login`, `DashboardScreen` → `GET /api/dashboard` (protegido,
  solo se ve si hay JWT válido).

## 5. Para la demo de la review

Flujo a mostrar: Registro → Login (se guarda el JWT) → Dashboard (pide datos protegidos con el
JWT) → Cerrar sesión (borra el token y vuelve a Login). Esto evidencia el flujo completo
`Usuario → Frontend → API → Base de Datos` pedido en la guía, ya en un dispositivo/emulador móvil.

## 6. Pendiente

- Conectar con el backend ya desplegado (no local) para que la demo no dependa de la misma red WiFi.
- Mockups en Figma como referencia visual antes de pulir el diseño final de cada pantalla.
- Íconos/splash reales en `assets/` (por ahora `app.json` solo define colores).
