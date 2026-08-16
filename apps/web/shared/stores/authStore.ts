import type { User } from "@shared/types/user.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isInitialized: boolean;
}

interface AuthActions {
  setCredentials: (user: User | null, accessToken: string | null) => void;
  setInitialized: () => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    // State
    user: null,
    accessToken: null,
    isInitialized: false,

    // Actions
    setCredentials: (user, accessToken) => set({ user, accessToken, isInitialized: true }, false, "auth/setCredentials"),
    setInitialized: () => set({ isInitialized: true }, false, "auth/setInitialized"),
    logout: () => set({ user: null, accessToken: null, isInitialized: true }, false, "auth/logout")
  }))
);
