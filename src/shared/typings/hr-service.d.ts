interface TeamOverviewCardResponse {
  team_id: string;
  name: string;
  lead_name: string;
  member_count: number;
  performance_score: number;
  status: "HEALTHY" | "AT_RISK" | "FLAGGED";
}
