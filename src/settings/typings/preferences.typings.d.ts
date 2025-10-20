type NotificationsPreferences = {
  email: boolean;
  push: boolean;
  in_app: boolean;
  task_reminders: boolean;
  team_updates: boolean;
};

type WorkingHoursPreferences = {
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  time_zone: string;
  availability: "Available" | "Busy" | "Away";
};
