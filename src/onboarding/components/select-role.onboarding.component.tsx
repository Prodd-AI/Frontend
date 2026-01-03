import { LoadingButton } from "@/components/ui/loading-button";
import SelectRoleCard from "@/shared/components/cards/select-role-card";
import { useCallback, useState } from "react";
import { role_cards } from "../utils/constants";
import useAuthStore from "@/config/stores/auth.store";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { update_user } from "@/config/services/users.service";
import { FiArrowUpRight } from "react-icons/fi";
import { TeamMember, TeamMemberRole } from "@/shared/typings/team-member";
import Banner from "@/shared/components/banner.component";

const NAVIGATION_DELAY = 1000;

function SelectRoleFormComponent() {
  const [selectedRoleValue, setSelectedRoleValue] =
    useState<TeamMemberRole>("team_member");
  const navigate = useNavigate();

  const removeAuthGuard =
    import.meta.env.VITE_REMOVE_AUTH_GUARD === "true" ||
    import.meta.env.VITE_REMOVE_AUTH_GUARD === "1";

  const handleRoleSelect = useCallback((role: TeamMemberRole) => {
    setSelectedRoleValue(role);
  }, []);
  const [banner, setBanner] = useState<{
    message: string;
    variant: "success" | "critical";
    isOpen: boolean;
  }>({
    message: "",
    variant: "success",
    isOpen: false,
  });
  const user = useAuthStore((state) => state.user);
  const register = useAuthStore((state) => state.register);

  const { mutate, isPending } = useMutation<
    GeneralReturnInt<TeamMember["user"]>,
    Error,
    Partial<TeamMember["user"]>
  >({
    mutationFn: (data) => update_user(data),
    onSuccess: (res) => {
      if (res.data) {
        register(res.data);
      }
      let onboardPath = "/";
      setBanner({
        message: "Role selected successfully! Redirecting to your dashboard...",
        variant: "success",
        isOpen: true,
      });
      switch (res.data?.user_role) {
        case "hr":
          onboardPath = "/onboarding/hr-setup";
          break;
        case "team_lead":
          onboardPath = "/onboarding/team-lead-setup";
          break;
        case "team_member":
          onboardPath = "/onboarding/team-member-setup";
          break;
        case "super_admin":
          onboardPath = "/onboarding/super-admin-setup";
          break;

        default:
          onboardPath = "/";
          break;
      }

      setTimeout(() => {
        navigate(onboardPath);
      }, NAVIGATION_DELAY);
    },
    onError: (error) => {
      setBanner({
        message: error.message,
        variant: "critical",
        isOpen: true,
      });

      if (removeAuthGuard) {
        return navigate(
          `/onboarding/${selectedRoleValue.replace("_", "-")}-setup`
        );
      }
    },
  });

  //commented out for now to avoid redirecting to login page
  // if (!user) {
  //   return <Navigate to="/auth/login" />;
  // }

  const handleContinue = () => {
    mutate({ user_role: selectedRoleValue });
  };

  return (
    <div>
      <Banner
        open={banner.isOpen}
        description={banner.message}
        onDismiss={() =>
          setBanner({ message: "", variant: "success", isOpen: false })
        }
        variant={banner.variant}
        isDismiss
      />
      <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row mt-10 gap-[11px]">
        {role_cards.map(({ title, description, value, Icon }) => (
          <SelectRoleCard
            key={value}
            index={value}
            title={title}
            description={description}
            onChangeFn={() => handleRoleSelect(value)}
            value={value}
            active={selectedRoleValue === value}
            Icon={Icon}
          />
        ))}
      </div>
      <div className="flex justify-center items-center mt-[4rem] sm:mt-[6.5rem] lg:mt-[6.5rem] md:mt-[6.5rem] ">
        <LoadingButton
          onClick={handleContinue}
          loading={isPending}
          loadingText="Saving your role..."
          className="w-full sm:w-[11.25rem] md:w-[11.25rem] lg:w-[11.25rem]"
        >
          <span className="flex items-center gap-2">
            Continue <FiArrowUpRight className="text-lg" />
          </span>
        </LoadingButton>
      </div>
    </div>
  );
}

export default SelectRoleFormComponent;
