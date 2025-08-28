import type { AuthState } from "@/shared/typings/auth.store";
import type { TeamMember } from "@/shared/typings/team-member";
import { create } from "zustand";

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  login: (user: TeamMember, token: string) =>
    set({ user, isAuthenticated: true, token }),
  logout: () => set({ user: null, isAuthenticated: false, token: null }),
}));

export default useAuthStore;
