declare module "@/settings/typings/account-settings.typings" {
  export type TwoFactorSettings = {
    enabled: boolean;
  };

  export type ConnectedApp = {
    id: string;
    name: "Slack" | "Jira" | "Calendar";
    status: "connected" | "disconnected";
  };
}
