interface AuthState {
  user: TeamMember | null;
  isAuthenticated: boolean;
  token: string | null;
  invite_otp: string | null;
  login: (user: TeamMember, token: string) => void;
  logout: () => void;
  setInviteOtp: (invite_otp: string) => void;
}
