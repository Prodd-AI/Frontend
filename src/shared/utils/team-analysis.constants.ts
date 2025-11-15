import { TeamAnalysisInfo } from "@/shared/typings/team-analysis-card";

export const sample_team_analyses: TeamAnalysisInfo[] = [
  {
    id: "eng",
    team_name: "Engineering",
    lead_name: "Sarah Johnson",
    avg_score: 3.58,
    member_count: 12,
    at_risk_count: 2,
    morale_percent: 85,
    participation_percent: 92,
  },
  {
    id: "design",
    team_name: "Design",
    lead_name: "Mike Chan",
    avg_score: 4.3,
    member_count: 25,
    at_risk_count: 0,
    morale_percent: 100,
    participation_percent: 92,
  },
];
