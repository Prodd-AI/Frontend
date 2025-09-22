type TwoFactorSettings = {
  enabled: boolean;
};

type ConnectedApp = {
  id: string;
  name: "Slack" | "Jira" | "Calendar";
  status: "connected" | "disconnected";
};
