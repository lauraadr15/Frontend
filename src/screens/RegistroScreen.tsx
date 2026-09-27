import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, radius } from "../theme/colors";
import { Rol } from "../types/domain";
import { AuthStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<AuthStackParamList, "Registro">;

const ROLES_DISPONIBLES: { valor: Rol; etiqueta: string }[] = [
  { valor: "PASAJERO", etiqueta: "Pasajero" },
  { valor: "CONDUCTOR", etiqueta: "Conductor" },
];

export function RegistroScreen({ navigation }: Props): React.JSX.Element {
  const { registrarse } = useAuth();

  const [nombre, setNombre] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");
  const [rol, setRol] = useState<Rol>("PASAJERO");
  const [error, setError] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  async function manejarRegistro(): Promise<void> {
    setError("");
    if (!nombre || !correo || !contrasena) {
      setError("Nombre, correo y contraseña son obligatorios");
      return;
    }
    if (contrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setCargando(true);
    try {
      await registrarse({ nombre, correo, contrasena, telefono, rol });
      // AuthContext ya inicia sesión automáticamente tras registrar.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
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
        <Text style={styles.titulo}>Crear cuenta</Text>
        <Text style={styles.subtitulo}>Únete a RideMove en Fusagasugá</Text>

        <InputField label="Nombre completo" value={nombre} onChangeText={setNombre} />
        <InputField
          label="Correo"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
        />
        <InputField
          label="Teléfono (opcional)"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
        <InputField
          label="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        <Text style={styles.etiquetaRol}>Quiero registrarme como</Text>
        <View style={styles.filaRoles}>
          {ROLES_DISPONIBLES.map((opcion) => (
            <Pressable
              key={opcion.valor}
              onPress={() => setRol(opcion.valor)}
              style={[
                styles.chipRol,
                rol === opcion.valor ? styles.chipRolActivo : null,
              ]}
            >
              <Text
                style={[
                  styles.textoChip,
                  rol === opcion.valor ? styles.textoChipActivo : null,
                ]}
              >
                {opcion.etiqueta}
              </Text>
            </Pressable>
          ))}
        </View>

        {error ? <Text style={styles.errorGeneral}>{error}</Text> : null}

        <PrimaryButton titulo="Registrarme" onPress={manejarRegistro} cargando={cargando} />

        <Text style={styles.enlace} onPress={() => navigation.navigate("Login")}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, padding: spacing.lg, paddingTop: spacing.xl },
  titulo: { fontSize: 26, fontWeight: "800", color: colors.text },
  subtitulo: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.lg },
  etiquetaRol: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  filaRoles: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  chipRol: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  chipRolActivo: { backgroundColor: colors.primary, borderColor: colors.primary },
  textoChip: { color: colors.text, fontWeight: "600" },
  textoChipActivo: { color: colors.surface },
  errorGeneral: { color: colors.danger, textAlign: "center", marginBottom: spacing.sm },
  enlace: { color: colors.primary, textAlign: "center", marginTop: spacing.lg, fontWeight: "600" },
});
