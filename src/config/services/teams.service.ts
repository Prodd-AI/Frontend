import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";
import { MyTeamMembership, TeamMember } from "@/shared/typings/team-member";
import {
  BulkAddTeamMembersData,
  CreateTeamData,
  Team,
  SingleTeamAnalysisMetrics,
} from "@/team-leader/typings/team-leader";

const teams_service = new ApiService(`${SERVER_URL}teams`);

const addTeamMembers = (data: BulkAddTeamMembersData) => {
  return teams_service.post<GeneralReturnInt<unknown>, BulkAddTeamMembersData>(
    "members/bulk",
    data,
    true,
  );
};

const createTeam = (data: CreateTeamData) => {
  return teams_service.post<GeneralReturnInt<unknown>, CreateTeamData>(
    "",
    data,
    true,
  );
};

const getTeams = (params?: { page?: string; limit?: string }) => {
  return teams_service.get<GeneralReturnInt<Team[]>>(
    "",
    params
      ? { page: params.page || "1", limit: params.limit || "100" }
      : undefined,
    true,
  );
};
const getMyTeams = (params?: { page?: string; limit?: string }) => {
  return teams_service.get<GeneralReturnInt<MyTeamMembership[]>>(
    "me",
    params
      ? { page: params.page || "1", limit: params.limit || "100" }
      : undefined,
    true,
  );
};

const getTeamMembers = (team_id: string) => {
  return teams_service.get<GeneralReturnInt<TeamMember["user"][]>>(
    `${team_id}/members`,
    undefined,
    true,
  );
};

const getTeamData = (team_id: string) => {
  return teams_service.get<GeneralReturnInt<Team>>(
    `${team_id}`,
    undefined,
    true,
  );
};
const getAnalysisMetricForSingleTeam = (
  team_id: string,
  params: {
    start_date: string;
    end_date: string;
  },
) => {
  return teams_service.get<GeneralReturnInt<SingleTeamAnalysisMetrics>>(
    `${team_id}/analysis`,
    params,
    true,
  );
};

/**
 * Org-wide HR analytics overview.
 * GET /api/v1/teams/analytics-dashboard
 */
const getAnalyticsDashboard = () =>
  teams_service.get<GeneralReturnInt<Record<string, unknown>>>(
    "analytics-dashboard",
    undefined,
    true,
  );

/**
 * Per-team performance metrics for all teams.
 * GET /api/v1/teams/teams-performance
 */
const getTeamsPerformance = () =>
  teams_service.get<GeneralReturnInt<Record<string, unknown>[]>>(
    "teams-performance",
    undefined,
    true,
  );

/**
 * Per-team participation + morale analysis for all teams.
 * GET /api/v1/teams/teams-analysis
 */
const getTeamsAnalysis = () =>
  teams_service.get<GeneralReturnInt<Record<string, unknown>[]>>(
    "teams-analysis",
    undefined,
    true,
  );

/**
 * Performance metrics for a single team.
 * GET /api/v1/teams/{team_id}/performance
 */
const getTeamPerformance = (team_id: string) =>
  teams_service.get<GeneralReturnInt<Record<string, unknown>>>(
    `${team_id}/performance`,
    undefined,
    true,
  );

export {
  addTeamMembers,
  createTeam,
  getTeams,
  getTeamMembers,
  getAnalysisMetricForSingleTeam,
  getMyTeams,
  getTeamData,
  getAnalyticsDashboard,
  getTeamsPerformance,
  getTeamsAnalysis,
  getTeamPerformance,
};
