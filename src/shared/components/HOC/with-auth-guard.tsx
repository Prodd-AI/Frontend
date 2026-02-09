import { ComponentType } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/config/stores/auth.store";
import { refresh_auth_with_team_member_profile } from "@/config/services/auth.service";
import Loader from "../loader.component";
import { TeamMember } from "@/shared/typings/team-member";

// Props that the HOC injects into the wrapped component
interface InjectedAuthProps {
  user: TeamMember | null;
}

/**
 * Higher Order Component that provides authentication guard with refresh token support.
 * Use this to wrap any component that requires authentication.
 *
 * This HOC will:
 * 1. Check if user is already authenticated in store
 * 2. If not, attempt to restore session using refresh token from localStorage
 * 3. Redirect to login if no valid session can be established
 *
 * Uses TanStack Query with side effects handled directly in queryFn for clean,
 * effect-free implementation.
 *
 * The wrapped component receives a `user` prop automatically injected by this HOC.
 */
function withAuthGuard<P extends InjectedAuthProps>(
  WrappedComponent: ComponentType<P>,
) {
  return function AuthGuardWrapper(props: Omit<P, keyof InjectedAuthProps>) {
    const { user, isAuthenticated } = useAuthStore();

    const { isLoading, isError } = useQuery({
      queryKey: ["auth", "session"],
      queryFn: async () => {
        const refresh_token_id = localStorage.getItem("refresh_token_id");
        if (!refresh_token_id) {
          throw new Error("No refresh token found");
        }

        try {
          const res = await refresh_auth_with_team_member_profile({
            refresh_token_id,
          });

          if (res.data?.user) {
            useAuthStore.getState().setUser(res.data, res.data.access_token);
            localStorage.setItem("refresh_token_id", res.data.refresh_token);
          }

          return res.data;
        } catch (error) {
          localStorage.removeItem("refresh_token_id");
          useAuthStore.setState({
            user: null,
            isAuthenticated: false,
            token: null,
          });
          throw error;
        }
      },
      enabled: !isAuthenticated || !user,
      retry: false,
      staleTime: Infinity,
    });

    if (isError && !isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }

    if (isLoading) {
      return (
        <div className="h-screen w-full flex justify-center items-center">
          <Loader />
        </div>
      );
    }

    if (!isAuthenticated || !user) {
      return <Navigate to="/auth/login" />;
    }

    return <WrappedComponent {...(props as P)} user={user} />;
  };
}

export default withAuthGuard;
