import { create } from "zustand";
import { AuthState } from "@/shared/typings/auth.store";

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  email: null,
  isAuthenticated: false,
  token: null,
  login: (user, token) => set({ user, isAuthenticated: true, token }),
  logout: () => set({ user: null, isAuthenticated: false, token: null }),
  setEmail: (email) => {
    set({
      email,
    });
  },
  setUser: (user, token) => {
    set({ user, token, isAuthenticated: true });
  },
  register: (user) => {
    set({
      user,
    });
  },
}));

export default useAuthStore;
