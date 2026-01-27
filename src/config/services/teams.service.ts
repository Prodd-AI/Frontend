import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";

const teams_service = new ApiService(`${SERVER_URL}teams`);

const addTeamMembers = (teams: Array<TeamMemberDetails>) => {
  return teams_service.post("members/bulk", {members :teams}, true);
};

export { addTeamMembers };
