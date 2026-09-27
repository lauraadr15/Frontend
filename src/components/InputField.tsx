import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { colors, spacing, radius } from "../theme/colors";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function InputField({ label, error, style, ...resto }: InputFieldProps): React.JSX.Element {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputConError : null, style]}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        {...resto}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { marginBottom: spacing.md },
  etiqueta: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  inputConError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 12, marginTop: spacing.xs },
});
