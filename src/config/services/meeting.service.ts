import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";

const meeting_service = new ApiService(`${SERVER_URL}meetings`);

// Types based on the API response
export interface MeetingOrganizer {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  is_verified: boolean;
  user_role: string;
  is_onboarded: boolean;
  avatar_url: string | null;
}

export interface MeetingAttendee {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  is_verified: boolean;
  user_role: string;
  is_onboarded: boolean;
  avatar_url: string | null;
}

export interface MeetingResponse {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  title: string;
  description: string;
  type: string;
  scheduled_at: string;
  status: "scheduled" | "cancelled" | "completed";
  meeting_link: string;
  organizer_id: string;
  organizer: MeetingOrganizer;
  attendees: MeetingAttendee[];
}

export interface UpcomingMeetingTodayResponse {
  id: string;
  title: string;
  description: string;
  type: string;
  scheduled_at: string;
  status: string;
  meeting_link: string;
  participant_count: number;
  start_in_minutes: number;
  remaining_meetings: {
    id: string;
    title: string;
    type: string;
    scheduled_at: string;
    status: string;
    meeting_link: string;
    organizer_id: string;
  }[];
}

const schedule_meeting = (data: {
  title: string;
  type: string;
  description: string;
  date: string;
  time: string;
  attendee_emails: string[];
  meeting_link: string;
}) => {
  return meeting_service.post<GeneralReturnInt<unknown>, typeof data>(
    "",
    data,
    true,
  );
};

const get_meetings = ({
  page = "1",
  limit = "10",
  status = "scheduled",
}: {
  page: string;
  limit: string;
  status: "scheduled" | "cancelled" | "completed";
}) => {
  return meeting_service.get<GeneralReturnInt<MeetingResponse[]>>(
    "",
    { page, limit, status },
    true,
  );
};

const get_upcoming_meetings_today = () => {
  /**this is the response type
   *  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2026-01-30T08:00:00.000Z",
    "updated_at": "2026-01-30T08:00:00.000Z",
    "deleted_at": null,
    "title": "Project Alpha Kickoff",
    "description": "Initial meeting to discuss project scope and milestones.",
    "type": "Team Sync",
    "scheduled_at": "2026-01-30T11:30:00.000Z",
    "status": "scheduled",
    "meeting_link": "https://meet.google.com/xyz-pdqr-mno",
    "organizer_id": "user-uuid-123",
    "organizer": {
      "id": "user-uuid-123",
      "first_name": "Sarah",
      "last_name": "Connor",
      "email": "sarah.c@prodily.com",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    },
    "attendees": [
      { "id": "user-uuid-123", "first_name": "Sarah", "last_name": "Connor" },
      { "id": "user-uuid-456", "first_name": "John", "last_name": "Doe" },
      { "id": "user-uuid-789", "first_name": "Alice", "last_name": "Smith" }
    ],
    "participant_count": 3,
    "start_in_minutes": 17,
    "remaining_meetings": [
      {
        "id": "660f9511-f30c-52e5-b827-557766551111",
        "title": "Design Review",
        "type": "Review",
        "scheduled_at": "2026-01-30T15:00:00.000Z",
        "status": "scheduled",
        "meeting_link": "https://meet.google.com/abc-defg-hij",
        "organizer_id": "user-uuid-456"
      }
    ]
  }
   */
  return meeting_service.get<GeneralReturnInt<UpcomingMeetingTodayResponse>>(
    "upcoming/today",
    undefined,
    true,
  );
};

export { schedule_meeting, get_meetings, get_upcoming_meetings_today };
