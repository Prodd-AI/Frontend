interface AuthState {
  user: TeamMember | null;
  isAuthenticated: boolean;
  token: string | null;
  email: string | null;
  login: (user: TeamMember, token: string) => void;
  register: (user: TeamMember) => void;
  logout: () => void;
  setEmail: (email: string) => void;
  setUser: (user: TeamMember, token: string) => void;
}
