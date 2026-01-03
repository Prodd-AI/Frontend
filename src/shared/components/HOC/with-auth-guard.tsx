import { ComponentType } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/config/stores/auth.store";
import { refresh_auth_with_team_member_profile } from "@/config/services/auth.service";
import Loader from "../loader.component";

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
 */
function withAuthGuard<P extends object>(WrappedComponent: ComponentType<P>) {
  return function AuthGuardWrapper(props: P) {
    const { user, isAuthenticated } = useAuthStore();

    const removeAuthGuard =
      import.meta.env.VITE_REMOVE_AUTH_GUARD === "true" ||
      import.meta.env.VITE_REMOVE_AUTH_GUARD === "1";

    const { isLoading, isError } = useQuery({
      queryKey: ["auth", "session"],
      queryFn: async () => {
        const refresh_token_id = localStorage.getItem("refresh_token_id");
        if (!refresh_token_id) {
          throw new Error("No refresh token found");
        }

        const res = await refresh_auth_with_team_member_profile({
          refresh_token_id,
        });

        if (res.data?.user) {
          useAuthStore.getState().setUser(res.data, res.data.access_token);
          localStorage.setItem("refresh_token_id", res.data.refresh_token);
        }

        return res.data;
      },
      enabled: !isAuthenticated || !user || !removeAuthGuard,
      retry: false,
      staleTime: Infinity,
    });

    if (isError && !removeAuthGuard) {
      useAuthStore.getState().logout();

      return <Navigate to="/auth/login" />;
    }

    if (isLoading) {
      return (
        <div className="h-screen w-full flex justify-center items-center">
          <Loader />
        </div>
      );
    }

    if (removeAuthGuard) {
      return <WrappedComponent {...props} />;
    }

    if (!isAuthenticated || !user) {
      return <Navigate to="/auth/login" />;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuthGuard;
