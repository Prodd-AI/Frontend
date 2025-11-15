declare module "@/shared/typings/auth.store" {
  import { TeamMember } from "@/shared/typings/team-member";

  export interface AuthState {
    user: TeamMember | null;
    isAuthenticated: boolean;
    token: string | null;
    login: (user: TeamMember, token: string) => void;
    logout: () => void;
  }
}
