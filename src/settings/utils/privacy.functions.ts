import type { VisibilityForm } from "@/config/forms/privacy.form";
import type {
  ActiveSession,
  VisibilitySettings,
} from "@/settings/typings/privacy.typings";

export const QUERY_KEY_PRIVACY = ["settings", "privacy"] as const;

export const simulate_fetch_privacy = (): Promise<{
  visibility: VisibilitySettings;
  sessions: ActiveSession[];
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        visibility: {
          profile_photo: "Everyone",
          contact_info: "Everyone",
          working_hours: "Everyone",
          activity_status: "Everyone",
        },
        sessions: [
          {
            id: "session-1",
            device: "MacBook Pro",
            location: "Lagos, Nigeria • Current session",
            is_current: true,
          },
          {
            id: "session-2",
            device: "iPhone 14",
            location: "Rumokoro, Portharcort",
            last_active_desc: "2 hours ago",
          },
        ],
      });
    }, 300);
  });
};

export const simulate_update_visibility = (
  payload: VisibilityForm
): Promise<VisibilitySettings> =>
  new Promise((resolve) => setTimeout(() => resolve(payload), 300));

export const simulate_end_session = (id: string): Promise<{ id: string }> =>
  new Promise((resolve) => setTimeout(() => resolve({ id }), 300));
