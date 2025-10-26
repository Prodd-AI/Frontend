type RegisterTeamMemberReturnInt = {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  is_verified: boolean;
  timezone: string | null;
  start_work_hour: string | null;
  end_work_hour: string | null;
  invite_otp: string;
  is_onboarded: boolean;
  avatar_url: string | null;
  organization_id: number | null;
} & TeamMember;
