import { ComponentType, useEffect, useRef, useState } from "react";
import Logo from "../Logo.component";
import { Bell } from "lucide-react";
import { Navigate } from "react-router-dom";
import useAuthStore from "@/config/stores/auth.store";
import { refresh_auth_with_team_member_profile } from "@/config/services/auth.service";
import Loader from "../loader.component";
import AviPlaceholder from "../avi-placeholder.component";
import HRBadgeIcon from "@/components/ui/hr-badge-icon";

/**
 * Higher Order Component that wraps a component with the team member screen scaffold
 * Provides authentication check, header with logo, notifications, and user profile
 * Automatically shows HR badge for users with HR role
 */
function withTeamMemberScaffold<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function TeamMemberScaffoldWrapper(
    props: P & WithTeamMemberScaffoldProps
  ) {
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

      const fetchUserProfile = async () => {
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
          console.error("Failed to fetch user profile:", err);

          useAuthStore.getState().logout();
        } finally {
          setIsRefreshing(false);
        }
      };

      fetchUserProfile();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { HeaderChild, ...componentProps } = props;

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

    const isHR = user?.user.user_role === "hr";

    // TODO: Implement notification logic
    const isNotification = true;

    return (
      <div className="h-svh overflow-auto px-[2.75rem] bg-[#F8F8F98A] ">
        {/* Header with logo, HR badge, notifications, and user profile */}
        <div className="flex justify-between items-center min-h-[96px]">
          <div className=" flex items-center gap-[1.75rem]">
            <Logo />
            {isHR && (
              <div className=" bg-linear-0 from-[#6619DE] to-[#934DFF] w-[116px] h-[26px] rounded-[5px] flex justify-center items-center gap-[5.4px] text-[0.7rem] text-[#F3F4F6]">
                <HRBadgeIcon />
                <span>HR Manager</span>
              </div>
            )}
          </div>
          <div className=" flex items-center gap-[3.75rem]">
            {HeaderChild}
            <div className="flex items-center gap-[4rem] ">
              {/**Bell */}
              <div className="relative">
                <Bell size={32} />
                {isNotification && (
                  <div className="size-[14px] bg-[#EF4444] rounded-full absolute top-0 left-5"></div>
                )}
              </div>
              <div className=" flex items-center">
                {user.user.avatar_url ? (
                  <div className="size">
                    <img
                      src={user?.user.avatar_url || "/placeholder-avatar.png"}
                      alt="Team Member Avatar"
                    />
                  </div>
                ) : (
                  <AviPlaceholder />
                )}

                <div className="flex flex-col ml-[11px]">
                  <h4 className="text-[#251F2D] font-bold text-[1rem  ]">{`${user?.user.first_name} ${user?.user.last_name}`}</h4>
                  <p className="text-[#6B7280] text-[1rem] font-[400]">
                    {user?.user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isRefreshing ? (
          <div className=" h-full w-full flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <WrappedComponent {...(componentProps as P)} />
        )}
      </div>
    );
  };
}

export default withTeamMemberScaffold;
