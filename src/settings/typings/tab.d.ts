declare module "@/settings/typings/tab" {
  const SettingsTab = {
    OVERVIEW = "overview",
    ACCOUNT = "account",
    PREFERENCES = "preferences",
    PRIVACY = "privacy",
    TEAM = "team",
  } as const;

  export type SettingsTab = (typeof SettingsTab)[keyof typeof SettingsTab];
}
