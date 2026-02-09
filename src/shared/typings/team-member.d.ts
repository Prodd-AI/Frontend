declare module "@/shared/typings/team-member" {
  type BaseTeamMember = {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    user_role: TeamMemberRole;
  };
  interface NotificationSettings {
    email_notifications: boolean;
    push_notifications: boolean;
    in_app_notifications: boolean;
    task_reminders: boolean;
    team_updates: boolean;
  }
  interface AvailabilitySettings {
    start_time: string;
    end_time: string;
    timezone: string;
    availability_status: Availability;
  }
  interface VisibiltySettings {
    profile_photo: Visibility;
    contact_info: Visibility;
    working_hours: Visibility;
    activity_status: Visibility;
  }
  export interface TeamMember {
    user: {
      id: string;
      email: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      is_verified: boolean;
      timezone: string | null;
      start_work_hour: string | null;
      end_work_hour: string | null;
      invite_otp: string | null;
      is_onboarded: boolean;
      organization_id: string | null;
    } & BaseTeamMember;
    access_token: string;
    refresh_token: string;
  }
  export type TeamMemberAccount = {
    job_title: string;
    bio_description: string;
    mfa_enabled: boolean;
    notification_setting: NotificationSettings;
    working_hours: AvailabilitySettings;
    profile_visibility: VisibiltySettings;
  } & BaseTeamMember;

  type Availability = "available" | "away" | "busy";
  type Visibility = "everyone" | "team" | "only me";
  const TeamMemberRole = {
    SUPER_ADMIN = "super_admin",
    TEAM_MEMBER = "team_member",
    TEAM_LEADER = "team_lead",
    HR = "hr",
    EXECUTIVE = "executive",
  } as const;

  type TeamMemberRole = (typeof TeamMemberRole)[keyof typeof TeamMemberRole];

  interface HourlyRate {
    rate: number;
    currency: string;
  }

  interface UserProfile {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    job_title: string;
    bio_description: string;
    mfa_enabled: boolean;
    notification_setting: NotificationSettings;
    working_hours: AvailabilitySettings;
    profile_visibility: VisibiltySettings;
    hourly_rate: HourlyRate;
  }

  export type CurrentUserProfile = {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    email: string;
    is_verified: boolean;
    timezone: string | null;
    invite_otp: string | null;
    invite_otp_expiry: string | null;
    is_onboarded: boolean;
    avatar_url: string | null;
    organization_id: string | null;
    user_profile: UserProfile;
  } & BaseTeamMember;
}
