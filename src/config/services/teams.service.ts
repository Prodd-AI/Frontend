import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";
import { TeamMember } from "@/shared/typings/team-member";
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

const getTeamMembers = (team_id: string) => {
  return teams_service.get<GeneralReturnInt<TeamMember["user"][]>>(
    `${team_id}/members`,
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

export {
  addTeamMembers,
  createTeam,
  getTeams,
  getTeamMembers,
  getAnalysisMetricForSingleTeam,
};
