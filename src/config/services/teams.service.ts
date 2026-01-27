import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";

const teams_service = new ApiService(`${SERVER_URL}teams`);

const addTeamMembers = (teams: Array<TeamMemberDetails>) => {
  return teams_service.post("members/bulk", { members: teams }, true);
};

interface CreateTeamData {
  name: string;
  description: string;
  size: string;
}

const createTeam = (data: CreateTeamData) => {
  return teams_service.post<
    GeneralReturnInt<unknown>,
    CreateTeamData
  >("", data, true);
};

export { addTeamMembers, createTeam };
