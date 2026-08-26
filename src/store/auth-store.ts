import { create } from "zustand";
import type { PublicUser } from "@/lib/types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthStoreState {
  status: AuthStatus;
  user: PublicUser | null;
  setAuthenticated: (user: PublicUser) => void;
  setUnauthenticated: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  status: "loading",
  user: null,
  setAuthenticated: (user) => set({ status: "authenticated", user }),
  setUnauthenticated: () => set({ status: "unauthenticated", user: null }),
}));
