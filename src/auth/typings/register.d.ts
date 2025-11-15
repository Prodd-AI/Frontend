type RegisterTeamMemberReturnInt = {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_verified: boolean;
  timezone: string | null;
  start_work_hour: string | null;
  end_work_hour: string | null;
  invite_otp: string;
  is_onboarded: boolean;
  avatar_url: string | null;
  organization_id: number | null;
} & Pick<TeamMember["user"], "last_name" | "first_name" | "email">;
