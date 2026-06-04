import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";

const integrations_service = new ApiService(`${SERVER_URL}integrations`);

// ──────────── Types ────────────

export interface IntegrationStatusMap {
  fireflies?: "connected" | "disconnected" | "error";
}

export interface MeetingTranscript {
  id: string;
  title: string;
  provider: string;
  external_id: string;
  transcript_text: string;
  ai_summary: string;
  ai_overview: { overview?: string; outline?: string[] } | null;
  action_items: string[] | string | null;
  keywords: string[];
  topics_discussed: string[];
  speakers: { id: string | number; name: string }[];
  participants: string[];
  meeting_attendees: {
    displayName?: string;
    email?: string;
    name?: string;
  }[];
  sentences: {
    index: number;
    speaker_name: string;
    text: string;
    start_time: number;
    end_time: number;
    ai_filters?: {
      task?: string | null;
      metric?: string | null;
      pricing?: string | null;
      question?: string | null;
      sentiment?: "positive" | "neutral" | "negative" | string | null;
      text_cleanup?: string | null;
      date_and_time?: string | null;
    };
  }[];
  analytics: {
    speakers?: {
      name: string;
      duration?: number;
      questions?: number;
      speaker_id?: string | number;
      word_count?: number;
      duration_pct?: number;
      words_per_minute?: number;
      filler_words?: number;
      longest_monologue?: number;
      monologues_count?: number;
    }[];
    categories?: {
      tasks?: number | null;
      metrics?: number | null;
      questions?: number | null;
      date_times?: number | null;
    };
    sentiments?: {
      neutral_pct?: number;
      negative_pct?: number;
      positive_pct?: number;
    };
  } | null;
  host_email: string | null;
  organizer_email: string | null;
  transcript_url: string;
  audio_url: string | null;
  video_url: string | null;
  duration: number;
  meeting_date: string;
  processing_status: string;
  meeting_type: string | null;
  meeting_link: string | null;
  created_at: string;
  extracted_tasks?: ExtractedTask[];
}

export const normalize_action_items = (
  actionItems: MeetingTranscript["action_items"],
) => {
  if (Array.isArray(actionItems)) {
    return actionItems.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof actionItems !== "string") return [];

  const lines = actionItems
    .split(/\r?\n/)
    .map((line) =>
      line.trim().replace(/^[-*]\s+/, "").replace(/^\d+[.)]\s+/, ""),
    )
    .filter(Boolean);

  return lines.reduce<string[]>((items, line, index) => {
    const nextLine = lines[index + 1];
    const previousLine = lines[index - 1];
    const isOwnerHeading = /^\*\*.+\*\*$/.test(line);
    const wasAfterOwnerHeading =
      previousLine && /^\*\*.+\*\*$/.test(previousLine);
    const cleanLine = line.replace(/\*\*/g, "");

    if (isOwnerHeading && nextLine) {
      items.push(`${cleanLine}: ${nextLine.replace(/\*\*/g, "")}`);
      return items;
    }

    if (wasAfterOwnerHeading) {
      return items;
    }

    items.push(cleanLine);
    return items;
  }, []);
};

export interface ExtractedTask {
  id: string;
  title: string;
  description: string;
  review_status: "pending_review" | "approved" | "rejected";
  priority: "high" | "medium" | "low";
  due_date: string | null;
  assignee_id: string | null;
  assignee?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  transcript_id: string;
  transcript?: MeetingTranscript;
  converted_task_id: string | null;
  suggested_assignee_name: string | null;
  suggested_assignee_email: string | null;
  source_context: string;
  created_at: string;
}

export interface IntegrationAssignee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_role: "team_lead" | "team_member";
  avatar_url?: string | null;
}

// ──────────── Integration Management ────────────

export const connect_integration = (data: {
  provider: "fireflies";
  api_key: string;
}) => {
  return integrations_service.post<
    GeneralReturnInt<{ provider: string; status: string }>,
    typeof data
  >("connect", data, true);
};

export const disconnect_integration = (data: { provider: "fireflies" }) => {
  return integrations_service.post<
    GeneralReturnInt<{ provider: string; status: string }>,
    typeof data
  >("disconnect", data, true);
};

export const get_integration_status = () => {
  return integrations_service.get<GeneralReturnInt<IntegrationStatusMap>>(
    "status",
    undefined,
    true,
  );
};

// ──────────── Meeting Sync ────────────

export const sync_meetings = () => {
  return integrations_service.post<
    GeneralReturnInt<{
      synced: number;
      skipped_duplicates: number;
      total_fetched: number;
    }>,
    undefined
  >("sync", undefined, true);
};

// ──────────── Transcripts ────────────

export const get_transcripts = (params?: {
  page?: string;
  limit?: string;
  search?: string;
}) => {
  return integrations_service.get<GeneralReturnInt<MeetingTranscript[]>>(
    "transcripts",
    params,
    true,
  );
};

export const get_transcript_by_id = (id: string) => {
  return integrations_service.get<GeneralReturnInt<MeetingTranscript>>(
    `transcripts/${id}`,
    undefined,
    true,
  );
};

// ──────────── Task Review ────────────

export const get_pending_tasks = (params?: {
  page?: string;
  limit?: string;
}) => {
  return integrations_service.get<GeneralReturnInt<ExtractedTask[]>>(
    "tasks/pending",
    params,
    true,
  );
};

export const get_integration_assignees = () => {
  return integrations_service.get<GeneralReturnInt<IntegrationAssignee[]>>(
    "tasks/assignees",
    undefined,
    true,
  );
};

export const review_task = (
  taskId: string,
  data: {
    review_status: "approved" | "rejected";
    title?: string;
    description?: string;
    assignee_id?: string;
    priority?: "high" | "medium" | "low";
    due_date?: string;
  },
) => {
  return integrations_service.patch<
    GeneralReturnInt<ExtractedTask>,
    typeof data
  >(`tasks/${taskId}/review`, data, true);
};

export const bulk_approve_tasks = (task_ids: string[]) => {
  return integrations_service.post<
    GeneralReturnInt<{ approved_count: number }>,
    { task_ids: string[] }
  >("tasks/bulk-approve", { task_ids }, true);
};
