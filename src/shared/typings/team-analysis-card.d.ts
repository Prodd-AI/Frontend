declare module "@/shared/typings/team-analysis-card" {
  export type TeamHealthStatus =
    | "healthy"
    | "at_risk"
    | "flagged"
    | "HEALTHY"
    | "AT_RISK"
    | "FLAGGED";

  export interface TeamAnalysisInfo {
    team_id: string;
    name: string;
    lead_name: string; // e.g., "Sarah Johnson"
    /** 0-100 — backend currently labels this `performance_score`. */
    performance_score: number;
    member_count: number; // e.g., 12
    status?: TeamHealthStatus;
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
