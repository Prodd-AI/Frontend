interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
}

enum TeamMemberRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  TEAM_MEMBER = "TEAM_MEMBER",
  TEAM_LEADER = "TEAM_LEADER",
  HR = "HR",
  EXECUTIVE = "EXECUTIVE",
}
