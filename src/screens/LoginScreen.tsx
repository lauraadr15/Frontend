import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { colors, spacing } from "../theme/colors";
import { AuthStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props): React.JSX.Element {
  const { iniciarSesion } = useAuth();

  const [correo, setCorreo] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  async function manejarLogin(): Promise<void> {
    setError("");
    if (!correo || !contrasena) {
      setError("Ingresa tu correo y tu contraseña");
      return;
    }
    setCargando(true);
    try {
      await iniciarSesion({ correo, contrasena });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>RideMove</Text>
        <Text style={styles.subtitulo}>Inicia sesión para pedir o atender un viaje</Text>

        <InputField
          label="Correo"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          placeholder="tucorreo@ejemplo.com"
        />
        <InputField
          label="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
          placeholder="••••••••"
        />

        {error ? <Text style={styles.errorGeneral}>{error}</Text> : null}

        <PrimaryButton titulo="Ingresar" onPress={manejarLogin} cargando={cargando} />

        <Text style={styles.enlace} onPress={() => navigation.navigate("Registro")}>
          ¿No tienes cuenta? Regístrate
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: "center", padding: spacing.lg },
  titulo: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  errorGeneral: {
    color: colors.danger,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  enlace: {
    color: colors.primary,
    textAlign: "center",
    marginTop: spacing.lg,
    fontWeight: "600",
  },
});
