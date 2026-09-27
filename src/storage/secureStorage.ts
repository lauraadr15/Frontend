import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "ridemove_token";

export const secureStorage = {
  async guardarToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async obtenerToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },

  async eliminarToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};
