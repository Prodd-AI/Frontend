interface TeamMember {
  id: string;
  first_name: string;
  last_name :string;
  email: string;
  user_role: TeamMemberRole;
}

enum TeamMemberRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  TEAM_MEMBER = "TEAM_MEMBER",
  TEAM_LEADER = "TEAM_LEADER",
  HR = "HR",
  EXECUTIVE = "EXECUTIVE",
}
