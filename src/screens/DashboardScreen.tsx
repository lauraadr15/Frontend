import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { dashboardService } from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, spacing, radius } from "../theme/colors";
import { DashboardResponse } from "../types/dto";

export function DashboardScreen(): React.JSX.Element {
  const { cerrarSesion } = useAuth();

  const [datos, setDatos] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(true);
  const [refrescando, setRefrescando] = useState<boolean>(false);

  const cargarDashboard = useCallback(async (): Promise<void> => {
    setError("");
    try {
      const respuesta = await dashboardService.obtenerResumen();
      setDatos(respuesta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la información");
    }
  }, []);

  useEffect(() => {
    cargarDashboard().finally(() => setCargando(false));
  }, [cargarDashboard]);

  async function manejarRefresco(): Promise<void> {
    setRefrescando(true);
    await cargarDashboard();
    setRefrescando(false);
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={styles.scroll}
      refreshControl={<RefreshControl refreshing={refrescando} onRefresh={manejarRefresco} />}
    >
      <Text style={styles.saludo}>Hola de nuevo 👋</Text>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : datos ? (
        <View style={styles.tarjeta}>
          <Text style={styles.mensaje}>{datos.mensajeBienvenida}</Text>
          <View style={styles.filaDato}>
            <Text style={styles.etiquetaDato}>Correo</Text>
            <Text style={styles.valorDato}>{datos.correo}</Text>
          </View>
          <View style={styles.filaDato}>
            <Text style={styles.etiquetaDato}>Rol</Text>
            <Text style={styles.valorDato}>{datos.rol}</Text>
          </View>
        </View>
      ) : null}

      <PrimaryButton titulo="Cerrar sesión" onPress={cerrarSesion} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingTop: spacing.xl, flexGrow: 1 },
  centrado: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  saludo: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: spacing.lg },
  tarjeta: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mensaje: { fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: spacing.md },
  filaDato: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  etiquetaDato: { color: colors.textMuted },
  valorDato: { color: colors.text, fontWeight: "600" },
  error: { color: colors.danger, marginBottom: spacing.lg, textAlign: "center" },
});
