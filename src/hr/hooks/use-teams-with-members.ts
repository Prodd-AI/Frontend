import { useQuery } from "@tanstack/react-query";
import { getTeamEntries } from "@/config/services/time-tracking.service";
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
  const { data: teamEntriesResponse, isLoading: is_loading } = useQuery({
    queryKey: ["time-tracking", "team-entries"],
    queryFn: () => getTeamEntries(),
  });

  const teamEntriesList = teamEntriesResponse?.data ?? [];
  const teamsWithMembers: TeamEntry[] = teamEntriesList.map((t, teamIndex) => {
    const people = (t.members ?? []).map((m) => ({
      id: m.user_id,
      name: m.full_name || "Unknown",
      role: formatUserRole(m.role ?? "team_member"),
      entries: m.entries_count ?? 0,
      hours: m.total_hours ?? 0,
      payout: 0,
    }));
    const total_payout = people.reduce((sum, p) => sum + (p.payout ?? 0), 0);
    return {
      id: t.team_id,
      team: t.team_name ?? "Team",
      icon_color: TEAM_ICON_COLORS[teamIndex % TEAM_ICON_COLORS.length],
      members_count: t.member_count ?? people.length,
      total_payout,
      total_hours: t.total_hours ?? 0,
      total_entries: t.total_entries ?? 0,
      people,
    };
  });

  return {
    teamsWithMembers,
    is_loading,
  };
}
