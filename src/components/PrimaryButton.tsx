import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  GestureResponderEvent,
} from "react-native";
import { colors, radius, spacing } from "../theme/colors";

interface PrimaryButtonProps {
  titulo: string;
  onPress: (evento: GestureResponderEvent) => void;
  cargando?: boolean;
  deshabilitado?: boolean;
}

export function PrimaryButton({
  titulo,
  onPress,
  cargando = false,
  deshabilitado = false,
}: PrimaryButtonProps): React.JSX.Element {
  const inactivo = cargando || deshabilitado;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      style={({ pressed }) => [
        styles.boton,
        inactivo ? styles.botonInactivo : null,
        pressed && !inactivo ? styles.botonPresionado : null,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={colors.surface} />
      ) : (
        <Text style={styles.texto}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  botonPresionado: { backgroundColor: colors.primaryDark },
  botonInactivo: { opacity: 0.6 },
  texto: { color: colors.surface, fontSize: 16, fontWeight: "600" },
});
