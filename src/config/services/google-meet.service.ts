import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";

/**
 * Google Meet link generation is server-side only.
 * The Meet API requires OAuth with scope meetings.space.created; refresh tokens
 * must be stored on the backend. Login Google Sign-In does NOT grant this scope.
 *
 * Expected backend endpoints:
 *   GET  /integrations/google/meet/status
 *   POST /integrations/google/meet/connect   { code }
 *   POST /integrations/google/meet/spaces    → { meeting_uri }
 */
const google_meet_service = new ApiService(`${SERVER_URL}integrations/google/meet`);

export interface GoogleMeetConnectionStatus {
  connected: boolean;
  google_email: string | null;
}

export interface GoogleMeetSpaceResponse {
  meeting_uri: string;
  meeting_code?: string;
  space_name?: string;
}

const get_google_meet_connection_status = () => {
  return google_meet_service.get<GeneralReturnInt<GoogleMeetConnectionStatus>>(
    "status",
    undefined,
    true,
  );
};

const connect_google_meet_account = (data: { code: string }) => {
  return google_meet_service.post<
    GeneralReturnInt<GoogleMeetConnectionStatus>,
    typeof data
  >("connect", data, true);
};

const create_google_meet_space = () => {
  return google_meet_service.post<
    GeneralReturnInt<GoogleMeetSpaceResponse>,
    Record<string, never>
  >("spaces", {}, true);
};

export {
  get_google_meet_connection_status,
  connect_google_meet_account,
  create_google_meet_space,
};