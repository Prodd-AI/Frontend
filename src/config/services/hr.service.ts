import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";

const hr_analytics_service = new ApiService(`${SERVER_URL}hr-analytics`);

/**
 * Get payroll breakdown for a Team or the whole Organization
 */
const get_team_payroll_summary = (params: {
  date_filter: "today" | "this_week" | "last_week" | "this_month" | "last_month";
  team_id?: string;
}) => {
  return hr_analytics_service.get<GeneralReturnInt<any>>("payroll/team-summary", params, true);
};

/**
 * Get At-Risk employees (Filter by Team, Employee, or All)
 */
const get_flight_risk = (params?: {
  team_id?: string;
  employee_id?: string;
}) => {
  return hr_analytics_service.get<GeneralReturnInt<any>>("flight-risk", params, true);
};

/**
 * Get the Healthy/At Risk card view for all teams
 */
const get_teams_overview_cards = () => {
  return hr_analytics_service.get<GeneralReturnInt<any>>("teams-overview-cards", undefined, true);
};

/**
 * Get detailed view for a specific team
 */
const get_team_detail = (team_id: string) => {
  return hr_analytics_service.get<GeneralReturnInt<any>>(`team-detail/${team_id}`, undefined, true);
};

/**
 * Get detailed view for a specific employee
 */
const get_employee_detail = (employee_id: string) => {
  return hr_analytics_service.get<GeneralReturnInt<any>>(`employee-detail/${employee_id}`, undefined, true);
};

export {
  get_team_payroll_summary,
  get_flight_risk,
  get_teams_overview_cards,
  get_team_detail,
  get_employee_detail,
};
