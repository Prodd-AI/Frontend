import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  get_transcript_by_id,
  MeetingTranscript,
  normalize_action_items,
} from "@/config/services/integrations.service";
import PageHeader from "@/shared/components/page-header.component";
import { VscLoading } from "react-icons/vsc";
import {
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiUsers,
  FiExternalLink,
  FiArrowLeft,
  FiPlay,
  FiLink,
  FiMail,
  FiMessageCircle,
} from "react-icons/fi";
import { IoCheckmarkCircle, IoFlag } from "react-icons/io5";
import { format } from "date-fns";

const cleanOverviewLines = (overview?: string) => {
  if (!overview) return [];

  return overview
    .split(/\r?\n/)
    .map((line) =>
      line
        .trim()
        .replace(/^[-*]\s+/, "")
        .replace(/\*\*/g, "")
        .replace(/\s{2,}/g, " "),
    )
    .filter(Boolean);
};

const formatPercent = (value?: number) =>
  typeof value === "number" ? `${Math.round(value)}%` : "0%";

function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ["transcript", id],
    queryFn: () => get_transcript_by_id(id!),
    enabled: !!id,
  });

  const transcript = response?.data as MeetingTranscript | undefined;
  const actionItems = normalize_action_items(transcript?.action_items ?? null);
  const overviewItems = cleanOverviewLines(transcript?.ai_overview?.overview);
  const attendeeLabels =
    transcript?.meeting_attendees?.length
      ? transcript.meeting_attendees.map(
          (attendee) =>
            attendee.displayName ||
            attendee.name ||
            attendee.email ||
            "Unknown attendee",
        )
      : transcript?.participants || [];
  const questionCount =
    transcript?.analytics?.categories?.questions ??
    transcript?.sentences?.filter((sentence) => sentence.ai_filters?.question)
      .length ??
    0;
  const sentiment = transcript?.analytics?.sentiments;

  const formatDuration = (seconds: number) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <VscLoading className="animate-spin text-3xl text-gray-400" />
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-400">Transcript not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <PageHeader
            title={transcript.title}
            subtitle={
              transcript.meeting_date
                ? format(
                    new Date(transcript.meeting_date),
                    "EEEE, MMMM d, yyyy 'at' h:mm a",
                  )
                : "Meeting transcript"
            }
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Duration",
            value: formatDuration(transcript.duration),
            icon: <FiClock />,
          },
          {
            label: "Participants",
            value: attendeeLabels.length,
            icon: <FiUsers />,
          },
          {
            label: "Action Items",
            value: actionItems.length,
            icon: <IoCheckmarkCircle />,
          },
          {
            label: "Questions",
            value: questionCount,
            icon: <FiMessageCircle />,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              {stat.icon}
              {stat.label}
            </div>
            <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* External links */}
      <div className="flex gap-3">
        {transcript.transcript_url && (
          <a
            href={transcript.transcript_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiExternalLink size={14} /> View on Fireflies
          </a>
        )}
        {transcript.audio_url && (
          <a
            href={transcript.audio_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiPlay size={14} /> Audio
          </a>
        )}
        {transcript.video_url && (
          <a
            href={transcript.video_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiPlay size={14} /> Video
          </a>
        )}
        {transcript.meeting_link && (
          <a
            href={transcript.meeting_link}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiLink size={14} /> Meeting Link
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Summary & Insights */}
        <div className="lg:col-span-1 space-y-4">
          {/* AI Summary */}
          {transcript.ai_summary && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">
                AI Summary
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {transcript.ai_summary}
              </p>
            </div>
          )}

          {/* AI Overview */}
          {overviewItems.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <FiBarChart2 className="text-blue-500" />
                AI Overview
              </h3>
              <ul className="space-y-2">
                {overviewItems.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-600 leading-relaxed flex gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {actionItems.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <IoCheckmarkCircle className="text-green-500" />
                Action Items
              </h3>
              <ul className="space-y-2">
                {actionItems.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meeting Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              Meeting Details
            </h3>
            <div className="space-y-3 text-sm">
              {transcript.meeting_date && (
                <div className="flex items-start gap-2 text-gray-600">
                  <FiCalendar className="mt-0.5 text-gray-400 shrink-0" />
                  <span>
                    {format(
                      new Date(transcript.meeting_date),
                      "MMM d, yyyy h:mm a",
                    )}
                  </span>
                </div>
              )}
              {transcript.organizer_email && (
                <div className="flex items-start gap-2 text-gray-600">
                  <FiMail className="mt-0.5 text-gray-400 shrink-0" />
                  <span className="break-all">{transcript.organizer_email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <FiActivity className="text-gray-400 shrink-0" />
                <span className="capitalize">
                  {transcript.provider || "Unknown provider"} ·{" "}
                  {transcript.processing_status || "Unknown status"}
                </span>
              </div>
            </div>
          </div>

          {/* Attendees */}
          {attendeeLabels.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <FiUsers className="text-primary-color" />
                Attendees
              </h3>
              <div className="space-y-2">
                {attendeeLabels.map((attendee) => (
                  <div
                    key={attendee}
                    className="text-sm text-gray-700 flex items-center gap-2 min-w-0"
                  >
                    <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-semibold shrink-0">
                      {attendee?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <span className="truncate">{attendee}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sentiment */}
          {sentiment && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">
                Sentiment
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Positive",
                    value: sentiment.positive_pct,
                    color: "bg-green-500",
                  },
                  {
                    label: "Neutral",
                    value: sentiment.neutral_pct,
                    color: "bg-gray-400",
                  },
                  {
                    label: "Negative",
                    value: sentiment.negative_pct,
                    color: "bg-red-500",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{item.label}</span>
                      <span>{formatPercent(item.value)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full ${item.color}`}
                        style={{ width: formatPercent(item.value) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topics */}
          {transcript.topics_discussed?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">
                Topics Discussed
              </h3>
              <div className="flex flex-wrap gap-2">
                {transcript.topics_discussed.map((topic, i) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {transcript.keywords?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {transcript.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Speakers */}
          {transcript.speakers?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">
                Speakers
              </h3>
              <div className="space-y-2">
                {transcript.speakers.map((speaker) => (
                  <div
                    key={speaker.id}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary-color/10 text-primary-color flex items-center justify-center text-xs font-semibold">
                      {speaker.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    {speaker.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Tasks */}
          {transcript.extracted_tasks &&
            transcript.extracted_tasks.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <IoFlag className="text-amber-500" />
                  Extracted Tasks ({transcript.extracted_tasks.length})
                </h3>
                <ul className="space-y-2">
                  {transcript.extracted_tasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          task.review_status === "approved"
                            ? "bg-green-50 text-green-600"
                            : task.review_status === "rejected"
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {task.review_status}
                      </span>
                      <span className="text-gray-700">{task.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        {/* Right column: Full Transcript */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-4">
              Full Transcript
            </h3>
            {transcript.sentences?.length > 0 ? (
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
                {transcript.sentences.map((s, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 shrink-0 mt-0.5">
                      {s.speaker_name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-gray-900">
                          {s.speaker_name}
                        </span>
                        {s.start_time !== undefined && (
                          <span className="text-[11px] text-gray-400">
                            {formatDuration(Math.round(s.start_time))}
                          </span>
                        )}
                        {s.ai_filters?.question && (
                          <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                            question
                          </span>
                        )}
                        {s.ai_filters?.task && (
                          <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">
                            task
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : transcript.transcript_text ? (
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed max-h-[700px] overflow-y-auto">
                {transcript.transcript_text}
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                No transcript text available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingDetailPage;
