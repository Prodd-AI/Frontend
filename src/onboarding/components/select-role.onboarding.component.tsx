import { Button } from "@/components/ui/button";
import SelectRoleCard from "@/shared/components/cards/select-role-card";
import { useCallback, useState } from "react";
import { role_cards } from "../utils/constants";
import useAuthStore from "@/config/stores/auth.store";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { update_user } from "@/config/services/users.service";
import { toast } from "sonner";
import { FiArrowUpRight } from "react-icons/fi";
import { TeamMember, TeamMemberRole } from "@/shared/typings/team-member";

const NAVIGATION_DELAY = 1000;

function SelectRoleFormComponent() {
  const [selectedRoleValue, setSelectedRoleValue] =
    useState<TeamMemberRole>("team_member");
  const navigate = useNavigate();
  const handleRoleSelect = useCallback((role: TeamMemberRole) => {
    setSelectedRoleValue(role);
  }, []);
  const user = useAuthStore((state) => state.user);

  const { mutate, isPending } = useMutation<
    GeneralReturnInt<TeamMember["user"]>,
    Error,
    Partial<TeamMember["user"]>
  >({
    mutationFn: (data) => update_user(data),
    onSuccess: (res) => {
      let onboardPath = "/";
      toast.success(
        "Role selected successfully! Redirecting to your dashboard..."
      );
      switch (res.data?.user_role) {
        case "hr":
          onboardPath = "/onboarding/hr-setup";
          break;
        case "team_leader":
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
      console.error(error);
    },
  });

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  const handleContinue = () => {
    mutate({ user_role: selectedRoleValue });
  };

  return (
    <div>
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
        <Button
          onClick={handleContinue}
          disabled={isPending}
          className={`${
            isPending && "opacity-50"
          } w-full sm:w-[7.566rem] md:w-[7.566rem] lg:w-[7.566rem]`}
        >
          {isPending ? (
            "Saving your role..."
          ) : (
            <span className="flex items-center gap-2">
              Continue <FiArrowUpRight className="text-lg" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

export default SelectRoleFormComponent;
