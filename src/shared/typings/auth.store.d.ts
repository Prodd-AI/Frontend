interface AuthState {
  user: TeamMember | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: TeamMember, token: string) => void;
  logout: () => void;
}
