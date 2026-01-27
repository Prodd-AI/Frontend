import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";

const organizations_api_service = new ApiService(`${SERVER_URL}organizations`);

const getOrganization = () => {
  return organizations_api_service.get("", undefined, true);
};

interface CreateOrganizationData {
  name: string;
  size: string;
  industry: string;
}

const createOrganization = (data: CreateOrganizationData) => {
  return organizations_api_service.post<
    GeneralReturnInt<unknown>,
    CreateOrganizationData
  >("", data, true);
};

export { getOrganization, createOrganization };