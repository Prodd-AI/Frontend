import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";

const meeting_service = new ApiService(`${SERVER_URL}meetings`);

const schedule_meeting = (data: {
  title: string;
  type: string;
  description: string;
  date: string;
  time: string;
  attendee_emails: string[];
}) => {
  return meeting_service.post<GeneralReturnInt<unknown>, typeof data>(
    "",
    data,
    true,
  );
};

export { schedule_meeting };
