import type {
  NotificationsForm,
  WorkingHoursForm,
} from "@/config/forms/preferences.form";
import type {
  NotificationsPreferences,
  WorkingHoursPreferences,
} from "@/settings/typings/preferences.typings";

export const QUERY_KEY_PREFERENCES = ["settings", "preferences"] as const;

export const simulate_fetch_preferences = (): Promise<{
  notifications: NotificationsPreferences;
  working_hours: WorkingHoursPreferences;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        notifications: {
          email: true,
          push: true,
          in_app: false,
          task_reminders: false,
          team_updates: false,
        },
        working_hours: {
          start_time: "09:00",
          end_time: "17:00",
          time_zone: "West African Time",
          availability: "Available",
        },
      });
    }, 300);
  });
};

export const simulate_update_notifications = (
  payload: NotificationsForm
): Promise<NotificationsPreferences> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ ...payload }), 300)
  );
};

export const simulate_update_working_hours = (
  payload: WorkingHoursForm
): Promise<WorkingHoursPreferences> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ ...payload }), 300)
  );
};
