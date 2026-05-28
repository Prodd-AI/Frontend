/**
 * Map a user's role to the dashboard prefix where the task detail page lives,
 * so the same task table works across team-lead / team-member / HR.
 */
const ROLE_TO_PREFIX: Record<string, string> = {
  hr: "/dash/hr",
  team_lead: "/dash/team-lead",
  team_member: "/dash/team-member",
};

export const getTaskDetailPath = (
  role: string | undefined,
  taskId: string,
): string => {
  const prefix = ROLE_TO_PREFIX[role ?? ""] ?? "/dash/team-member";
  return `${prefix}/tasks/${taskId}`;
};
