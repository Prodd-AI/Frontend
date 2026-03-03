export interface TeamOverviewCardResponse {
  team_id: string;
  name: string;
  lead_name: string;
  member_count: number;
  performance_score: number;
  status: "HEALTHY" | "AT_RISK" | "FLAGGED";
}

/** Response from GET /api/v1/hr-analytics/payroll/team-summary */
export interface PayrollTeamSummaryData {
  currency?: string;
  total_employees?: number;
  total_hours?: number;
  total_payout?: number;
  avg_hourly_rate?: number;
  regular?: { hours: number; cost: number };
  overtime?: { hours: number; cost: number };
  project_breakdown?: unknown[];
}
