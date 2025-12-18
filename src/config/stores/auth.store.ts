import { create } from "zustand";
import { AuthState } from "@/shared/typings/auth.store";
import { logout as logoutService } from "@/config/services/auth.service";

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  email: null,
  isAuthenticated: false,
  token: null,
  login: (user, token) => set({ user, isAuthenticated: true, token }),
  logout: async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      localStorage.removeItem("refresh_token_id");
      set({ user: null, isAuthenticated: false, token: null });
    }
  },
  setEmail: (email) => {
    set({
      email,
    });
  },
  setUser: (user, token) => {
    set({ user, token, isAuthenticated: true });
  },
  register: (userData) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, user: { ...state.user.user, ...userData } }
        : null,
    })),
}));

export default useAuthStore;

