export const QUERY_KEY_TEAM_DETAILS = ["settings", "team"] as const;

export const simulate_fetch_team_details = (): Promise<{
  team: TeamInfo;
  members: TeamMemberItem[];
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        team: {
          name: "Engineering Team",
          lead_name: "Sarah Johnson",
          department: "Technology Department",
          members_count: 12,
          active_projects: 22,
        },
        members: [
          {
            id: "1",
            name: "Sarah Johnson",
            role: "Team Lead • Engineering",
            is_lead: true,
          },
          { id: "2", name: "Team Members", role: "Senior Developer" },
          { id: "3", name: "Alice Johnson", role: "Frontend Developer" },
          { id: "4", name: "Bob Smith", role: "Backend Developer" },
        ],
      });
    }, 300);
  });
};
