export const SettingsTab = {
  OVERVIEW: "overview",
  ACCOUNT: "account",
  PREFERENCES: "preferences",
  PRIVACY: "privacy",
  TEAM: "team",
  INTEGRATIONS: "integrations",
} as const;

export type SettingsTab = (typeof SettingsTab)[keyof typeof SettingsTab];
