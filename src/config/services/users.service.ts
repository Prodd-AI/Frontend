import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";
import { TeamMember } from "@/shared/typings/team-member";

const user_api_client = new ApiService(SERVER_URL + "users");

const update_user = (data: Partial<TeamMember["user"]>) => {
  const { user_role, avatar_url, ...rest } = data;

  const transformedData = {
    ...rest,
    ...(user_role !== undefined && { user_role }),
    ...(avatar_url !== "" && { avatar_url }),
  };

  return user_api_client.patch<
    GeneralReturnInt<TeamMember["user"]>,
    typeof transformedData
  >("profile", transformedData, true);
};

export { update_user };
