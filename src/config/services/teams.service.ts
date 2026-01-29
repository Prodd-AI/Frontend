import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";
import { TeamMember } from "@/shared/typings/team-member";

const teams_service = new ApiService(`${SERVER_URL}teams`);

interface BulkAddTeamMembersData {
  members: Array<{
    email: string;
    first_name: string;
    last_name: string;
    user_role: string;
    team_id: string;
  }>;
}

const addTeamMembers = (data: BulkAddTeamMembersData) => {
  return teams_service.post<GeneralReturnInt<unknown>, BulkAddTeamMembersData>(
    "members/bulk",
    data,
    true,
  );
};

interface CreateTeamData {
  name: string;
  description: string;
  size: string;
}

const createTeam = (data: CreateTeamData) => {
  return teams_service.post<GeneralReturnInt<unknown>, CreateTeamData>(
    "",
    data,
    true,
  );
};

interface Team {
  id: string;
  name: string;
  description?: string;
  size?: string;
  created_at?: string;
  created_by_id?: string;
  deleted_at?: string;
  organization_id: string;
  updated_at: string;
}

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

export { addTeamMembers, createTeam, getTeams, getTeamMembers };
