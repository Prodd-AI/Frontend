import type { TeamMember } from "@/shared/typings/team-member";

export const getRolePath = (role?: string | null) =>
  role?.replace(/_/g, "-") ?? "";

export const getPostLoginPath = (user: TeamMember["user"]): string => {
  const rolePath = getRolePath(user.user_role);

  if (user.organization_id && user.is_onboarded) {
    return rolePath ? `/dash/${rolePath}` : "/";
  }

  if (user.organization_id && !user.is_onboarded) {
    return rolePath
      ? `/onboarding/${rolePath}-setup`
      : "/onboarding/hr-setup";
  }

  return "/onboarding/hr-setup";
};

export const persistAuthSession = (
  data: TeamMember,
  login: (user: TeamMember, token: string) => void,
) => {
  login(data, data.access_token);
  localStorage.setItem("refresh_token_id", data.refresh_token);
};