import { useQueries, useQuery } from "@tanstack/react-query";
import { getTeams, getTeamMembers } from "@/config/services/teams.service";
import type { TeamEntry } from "@/shared/components/team-entry-card.component";

const TEAM_ICON_COLORS = [
  "bg-[#934DFF]",
  "bg-[#0EB5C9]",
  "bg-[#DF38D3]",
  "bg-[#F59E0B]",
  "bg-[#10B981]",
];

function formatUserRole(role: string): string {
  const map: Record<string, string> = {
    super_admin: "Super Admin",
    team_member: "Team Member",
    team_lead: "Team Lead",
    hr: "HR",
    executive: "Executive",
  };
  return map[role] ?? role.replace(/_/g, " ");
}

export function useTeamsWithMembers() {
  const { data: teamsResponse, isLoading: teamsLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: () => getTeams({ limit: "100" }),
  });

  const teams = teamsResponse?.data ?? [];
  const teamIds = teams.map((t) => t.id);

  const memberQueries = useQueries({
    queries: teamIds.map((teamId) => ({
      queryKey: ["team-members", teamId],
      queryFn: () => getTeamMembers(teamId),
      enabled: teamIds.length > 0,
    })),
  });

  const isMembersLoading = memberQueries.some((q) => q.isLoading);
  const teamsWithMembers: TeamEntry[] = teams.map((team, teamIndex) => {
    const memberQuery = memberQueries[teamIndex];
    const members = memberQuery?.data?.data ?? [];
    const people = members.map((user: { id: string; first_name: string; last_name: string; user_role: string }) => ({
      id: user.id,
      name: [user.first_name, user.last_name].filter(Boolean).join(" ") || "Unknown",
      role: formatUserRole(user.user_role ?? "team_member"),
      entries: 0, // Backend can provide when timesheet/payroll APIs return per-member data
      hours: 0,
      payout: 0,
    }));
    const total_payout = people.reduce((sum, p) => sum + (p.payout ?? 0), 0);
    const total_hours = people.reduce((sum, p) => sum + (p.hours ?? 0), 0);
    const total_entries = people.reduce((sum, p) => sum + (p.entries ?? 0), 0);
    return {
      id: team.id,
      team: team.name,
      icon_color: TEAM_ICON_COLORS[teamIndex % TEAM_ICON_COLORS.length],
      members_count: people.length,
      total_payout,
      total_hours,
      total_entries,
      people,
    };
  });

  return {
    teamsWithMembers,
    is_loading: teamsLoading || isMembersLoading,
  };
}
