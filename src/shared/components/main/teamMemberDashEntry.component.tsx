import useAuthStore from "@/config/stores/auth.store";
import { Navigate } from "react-router-dom";

function TeamMemberDashEntry() {
  //determine team member role and redirect based on the user role
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  if (!user.user.user_role) {
    return <Navigate to="/onboarding/select-role" />;
  }
  const { user: teamMember } = user;
  const { user_role } = teamMember;
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
