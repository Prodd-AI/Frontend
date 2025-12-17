import { ComponentType, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
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
 */
function withAuthGuard<P extends object>(WrappedComponent: ComponentType<P>) {
  return function AuthGuardWrapper(props: P) {
    const [isRefreshing, setIsRefreshing] = useState(true);
    const { user, isAuthenticated, setUser } = useAuthStore();
    const hasFetchedProfile = useRef(false);

    useEffect(() => {
      if (isAuthenticated && user) {
        hasFetchedProfile.current = true;
        setIsRefreshing(false);
        return;
      }

      if (hasFetchedProfile.current) {
        setIsRefreshing(false);
        return;
      }

      const restoreSession = async () => {
        try {
          const refresh_token_id = localStorage.getItem("refresh_token_id");
          if (!refresh_token_id) {
            useAuthStore.getState().logout();
            setIsRefreshing(false);
            return;
          }

          const res = await refresh_auth_with_team_member_profile({
            refresh_token_id,
          });

          if (res.data?.user) {
            setUser(res.data, res.data.access_token);
            localStorage.setItem("refresh_token_id", res.data.refresh_token);
            hasFetchedProfile.current = true;
          }
        } catch (err) {
          console.error("Failed to restore session:", err);
          useAuthStore.getState().logout();
        } finally {
          setIsRefreshing(false);
        }
      };

      restoreSession();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isRefreshing) {
      return (
        <div className="h-screen w-full flex justify-center items-center">
          <Loader />
        </div>
      );
    }

    if (!isAuthenticated || !user) {
      return <Navigate to="/auth/login" />;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuthGuard;
