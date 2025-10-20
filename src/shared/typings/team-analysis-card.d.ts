interface TeamAnalysisInfo {
  id: string;
  team_name: string;
  lead_name: string; // e.g., "Sarah Johnson"
  avg_score: number; // e.g., 3.58
  member_count: number; // e.g., 12
  at_risk_count: number; // e.g., 2
  morale_percent: number; // 0-100
  participation_percent: number; // 0-100
}

interface TeamAnalysisActions {
  on_view?: (id: string) => void;
}

type TeamAnalysisCardProps = {
  team: TeamAnalysisInfo;
  actions?: TeamAnalysisActions;
  className?: string;
};
