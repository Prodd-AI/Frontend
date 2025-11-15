declare module "@/settings/typings/privacy.typings" {
  export type VisibilityOption = "Everyone" | "Team" | "Only me";

  export type VisibilitySettings = {
    profile_photo: VisibilityOption;
    contact_info: VisibilityOption;
    working_hours: VisibilityOption;
    activity_status: VisibilityOption;
  };

  export type ActiveSession = {
    id: string;
    device: string;
    location: string;
    is_current?: boolean;
    last_active_desc?: string;
  };
}
