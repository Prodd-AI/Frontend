import { create } from "zustand";

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  invite_otp: null,
  login: (user: TeamMember, token: string) =>
    set({ user, isAuthenticated: true, token }),
  logout: () => set({ user: null, isAuthenticated: false, token: null }),
  setInviteOtp: (invite_otp: string) =>
    set({
      invite_otp,
    }),
}));

export default useAuthStore;
