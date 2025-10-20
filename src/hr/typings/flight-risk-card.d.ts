type FlightRiskStatus = "at_risk" | "watch" | "healthy";

interface FlightRiskInfo {
  id: string;
  member_name: string; // e.g., "Alex Chan"
  role_title: string; // e.g., "Frontend Develop"
  team_name: string; // e.g., "Engineering Team"
  avg_mood_score: number; // e.g., 2.1
  avg_mood_scale?: number; // e.g., 5
  task_completion_percent: number; // e.g., 55
  weekly_streak_days: number; // e.g., 2
  last_checkin_label: string; // e.g., "2 days ago"
  status: FlightRiskStatus;
  risk_factors?: string[]; // e.g., ["Very low task completion", ...]
  scheduled_call_label?: string; // e.g., "Call scheduled for 1/21/2024"
}

interface FlightRiskActions {
  on_schedule_one_to_one?: (id: string) => void;
  on_contact_team_lead?: (id: string) => void;
  on_view_profile?: (id: string) => void;
  on_see_more?: (id: string) => void;
}

type FlightRiskCardProps = {
  person: FlightRiskInfo;
  actions?: FlightRiskActions;
  className?: string;
};
