import { TeamMember } from "@/shared/typings/team-member";
import { Navigate } from "react-router-dom";

interface TeamMemberDashEntryProps {
  user: TeamMember | null;
}

function TeamMemberDashEntry({ user }: TeamMemberDashEntryProps) {
  //determine team member role and redirect based on the user role

  if (!user || !user.user.user_role) {
    return <Navigate to="/auth/login" />;
  }

  const { user: teamMember } = user;

  const { user_role } = teamMember;
  // if (!is_onboarded) {
  //   switch (user_role) {
  //     case "hr":
  //       return <Navigate to="/onboarding/hr-setup" />;
  //     case "team_lead":
  //       return <Navigate to="/onboarding/team-lead-setup" />;
  //     default:
  //       return <Navigate to="/auth/login" />;
  //   }
  // }
  switch (user_role) {
    case "hr":
      return <Navigate to="/dash/hr" />;
    case "team_lead":
      return <Navigate to="/dash/team-lead" />;
    case "team_member":
      return <Navigate to="/dash/team-member" />;

    case "super_admin":
      return <Navigate to="/dash/admin" />;
    default:
      return <Navigate to="/auth/login" />;
  }
}

export default TeamMemberDashEntry;
