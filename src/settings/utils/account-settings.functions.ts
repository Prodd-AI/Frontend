import type {
  PasswordUpdateForm,
  TwoFactorForm,
} from "@/config/forms/account-settings.form";
import {
  TwoFactorSettings,
  ConnectedApp,
} from "@/settings/typings/account-settings.typings";

export const QUERY_KEY_ACCOUNT_SETTINGS = ["settings", "account"] as const;

export const simulate_fetch_account_settings = (): Promise<{
  two_factor: TwoFactorSettings;
  apps: ConnectedApp[];
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        two_factor: { enabled: false },
        apps: [
          { id: "slack", name: "Slack", status: "disconnected" },
          { id: "jira", name: "Jira", status: "connected" },
          { id: "calendar", name: "Calendar", status: "connected" },
        ],
      });
    }, 300);
  });
};

export const simulate_update_password = (
  _payload: PasswordUpdateForm
): Promise<{ success: boolean }> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true }), 500)
  );
};

export const simulate_update_two_factor = (
  payload: TwoFactorForm
): Promise<TwoFactorSettings> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ enabled: payload.enabled }), 400)
  );
};

export const simulate_toggle_app = (
  app_id: string,
  connect: boolean
): Promise<{ id: string; status: ConnectedApp["status"] }> => {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({ id: app_id, status: connect ? "connected" : "disconnected" }),
      400
    )
  );
};
