import type { User } from "@shared/types/user.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

interface AuthActions {
  setCredentials: (user: User | null, accessToken: string | null) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    // State
    user: null,
    accessToken: null,

    // Actions
    setCredentials: (user, accessToken) => set({ user, accessToken }, false, "auth/setCredentials"),
    logout: () => set({ user: null, accessToken: null }, false, "auth/logout")
  }))
);
