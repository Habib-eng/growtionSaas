// src/lib/localStorageManager.ts

const TOKEN_KEY = 'token';

export const localStorageManager = {
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
};
