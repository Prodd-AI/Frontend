declare module "@/shared/typings/team-analysis-card" {
  export interface TeamAnalysisInfo {
    team_id: string;
    name: string;
    lead_name: string; // e.g., "Sarah Johnson"
    performance_score: number; // e.g., 3.58
    member_count: number; // e.g., 12
    at_risk_count: number; // e.g., 2
    morale_percent: number; // 0-100
    participation_percent: number; // 0-100
  }

  export interface TeamAnalysisActions {
    on_view?: (id: string) => void;
  }

  export type TeamAnalysisCardProps = {
    team: TeamAnalysisInfo;
    actions?: TeamAnalysisActions;
    className?: string;
  };
}
