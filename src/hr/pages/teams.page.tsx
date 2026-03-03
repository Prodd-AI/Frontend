import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoBackBtn from "@/shared/components/go-back-btn";
import WelcomeBackHeader from "@/shared/components/welcome-back-header.component";
import TeamOverviewCard from "@/hr/components/team-overview-card.component";
import AddTeamForm from "@/hr/components/add-team-form.component";
import { getMyTeams } from "@/config/services/teams.service";
import { get_teams_overview_cards } from "@/config/services/hr.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Search } from "lucide-react";
import type { TeamOverviewCardResponse } from "@/shared/typings/hr-service";

function Teams() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: myTeamsData, isLoading: isTeamsLoading } = useQuery({
    queryKey: ["my-teams"],
    queryFn: () => getMyTeams(),
  });

  const { data: overviewData } = useQuery({
    queryKey: ["teams-overview-cards"],
    queryFn: () => get_teams_overview_cards(),
  });

  const teams = useMemo(() => myTeamsData?.data ?? [], [myTeamsData?.data]);
  const overviewCards = overviewData?.data ?? [];
  const overviewMap = new Map(overviewCards.map((t) => [t.team_id, t]));

  const filteredTeams = useMemo(() => {
    if (!debouncedSearch) return teams;
    const query = debouncedSearch.toLowerCase();
    return teams.filter((m) => m.team.name.toLowerCase().includes(query));
  }, [teams, debouncedSearch]);

  const statusToHealth = (
    status?: TeamOverviewCardResponse["status"],
  ): "healthy" | "at_risk" | "critical" => {
    switch (status) {
      case "AT_RISK":
        return "at_risk";
      case "FLAGGED":
        return "critical";
      default:
        return "healthy";
    }
  };

  return (
    <div>
      <GoBackBtn title="Back to home" path="/dash/hr" />
      <WelcomeBackHeader
        heading="Teams Overview"
        subHeading="Manage and monitor all teams across your organization."
        className="mt-5"
        child={
          <AddTeamForm
            trigger={
              <Button>
                <Plus /> Add Team
              </Button>
            }
          />
        }
      />

      <div className="relative mt-6 w-fit">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <Input
          placeholder="Search Team"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-full border-none bg-[#F3F0F7] shadow-none focus-visible:ring-0"
        />
      </div>

      {isTeamsLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 text-primary-color animate-spin" />
        </div>
      ) : filteredTeams.length === 0 ? (
        <p className="text-center text-gray-400 italic text-sm py-20">
          {debouncedSearch ? "No teams match your search." : "No teams found."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredTeams.map((membership) => {
            const overview = overviewMap.get(membership.team.id);
            return (
              <TeamOverviewCard
                key={membership.id}
                teamName={membership.team.name}
                leadName={overview?.lead_name ?? "—"}
                health={statusToHealth(overview?.status)}
                teamSize={
                  (overview?.member_count ?? Number(membership.team.size)) || 0
                }
                performance={overview?.performance_score ?? 0}
                onViewDetails={() =>
                  navigate(`/dash/hr/teams/${membership.team.id}`)
                }
              />
            );
          })}
        </div>
      )}
    
    </div>
  );
}

export default Teams;
