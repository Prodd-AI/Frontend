type VisibilityOption = "Everyone" | "Team" | "Only me";

type VisibilitySettings = {
  profile_photo: VisibilityOption;
  contact_info: VisibilityOption;
  working_hours: VisibilityOption;
  activity_status: VisibilityOption;
};

type ActiveSession = {
  id: string;
  device: string;
  location: string;
  is_current?: boolean;
  last_active_desc?: string;
};
