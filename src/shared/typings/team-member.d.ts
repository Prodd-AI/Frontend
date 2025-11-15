declare module "@/shared/typings/team-member" {
  export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: TeamMemberRole;
  }

  export enum TeamMemberRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    TEAM_MEMBER = "TEAM_MEMBER",
    TEAM_LEADER = "TEAM_LEADER",
    HR = "HR",
    EXECUTIVE = "EXECUTIVE",
  }
}
