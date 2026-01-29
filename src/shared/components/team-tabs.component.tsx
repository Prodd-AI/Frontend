import { cn } from "@/lib/utils";

interface Team {
  team_id: string;
  team_name: string;
}

interface TeamTabsProps {
  teams: Team[];
  activeTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const TeamTabs = ({
  teams,
  activeTeamId,
  onSelectTeam,
  isLoading = false,
  className,
}: TeamTabsProps) => {
  if (isLoading) {
    return (
      <div className={cn("p-3", className)}>
        <p className="text-sm text-muted-foreground">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2 overflow-auto", className)}>
      {teams.map((team) => (
        <button
          type="button"
          onClick={() => onSelectTeam(team.team_id)}
          className={cn(
            "px-3 py-1.5 text-xs border-b-2 font-medium text-black transition-colors cursor-pointer whitespace-nowrap",
            activeTeamId === team.team_id
              ? "border-primary"
              : "border-transparent text-muted-foreground hover:text-black hover:border-muted-foreground",
          )}
          key={team.team_id}
        >
          {team.team_name}
        </button>
      ))}
    </div>
  );
};

export default TeamTabs;
