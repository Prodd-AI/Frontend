declare module "@/shared/typings/team-member" {
  export interface TeamMember {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      user_role: TeamMemberRole;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      is_verified: boolean;
      timezone: string | null;
      start_work_hour: string | null;
      end_work_hour: string | null;
      invite_otp: string | null;
      is_onboarded: boolean;
      avatar_url: string | null;
      organization_id: string | null;
    };
    access_token: string;
    refresh_token: string;
  }

  const TeamMemberRole = {
    SUPER_ADMIN = "super_admin",
    TEAM_MEMBER = "team_member",
    TEAM_LEADER = "team_lead",
    HR = "hr",
    EXECUTIVE = "executive",
  } as const;

  type TeamMemberRole = (typeof TeamMemberRole)[keyof typeof TeamMemberRole];
}
