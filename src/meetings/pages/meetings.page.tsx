import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  get_transcripts,
  normalize_action_items,
  sync_meetings,
  type MeetingTranscript,
} from "@/config/services/integrations.service";
import PageHeader from "@/shared/components/page-header.component";
import { toast } from "sonner";
import { IoSearch, IoSync } from "react-icons/io5";
import { FiClock, FiUsers,} from "react-icons/fi";
import { VscLoading } from "react-icons/vsc";
import { format } from "date-fns";

function MeetingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ["transcripts", page, search],
    queryFn: () =>
      get_transcripts({
        page: String(page),
        limit: "10",
        ...(search ? { search } : {}),
      }),
  });

  const transcripts = response?.data || [];
  const meta = response?.meta;

  const syncMutation = useMutation({
    mutationFn: sync_meetings,
    onSuccess: (res) => {
      toast.success(
        `Synced ${res.data.synced} meeting(s) from Fireflies.`,
      );
      queryClient.invalidateQueries({ queryKey: ["transcripts"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const formatDuration = (seconds: number) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Meeting Intelligence"
        subtitle="Synced meeting transcripts and AI-extracted insights"
      />

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transcripts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent bg-white"
          />
        </div>

        <button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary-color rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {syncMutation.isPending ? (
            <VscLoading className="animate-spin" />
          ) : (
            <IoSync />
          )}
          Sync from Fireflies
        </button>
      </div>

      {/* Meetings List */}
      <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <VscLoading className="animate-spin text-2xl text-gray-400" />
          </div>
        ) : transcripts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">
              No transcripts found.{" "}
              <button
                onClick={() => syncMutation.mutate()}
                className="text-primary-color hover:underline"
              >
                Sync now
              </button>{" "}
              or connect Fireflies in{" "}
              <button
                onClick={() => navigate("/settings?tab=integrations")}
                className="text-primary-color hover:underline"
              >
                Settings → Integrations
              </button>
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transcripts.map((t: MeetingTranscript) => {
              const actionItems = normalize_action_items(t.action_items);

              return (
                <div
                  key={t.id}
                  onClick={() => navigate(`${t.id}`)}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {t.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-1.5">
                      {t.meeting_date && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FiClock size={12} />
                          {format(
                            new Date(t.meeting_date),
                            "MMM d, yyyy 'at' h:mm a",
                          )}
                        </span>
                      )}
                      {t.duration && (
                        <span className="text-xs text-gray-400">
                          {formatDuration(t.duration)}
                        </span>
                      )}
                      {t.participants?.length > 0 && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FiUsers size={12} />
                          {t.participants.length} participants
                        </span>
                      )}
                    </div>
                    {t.ai_summary && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {t.ai_summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    {actionItems.length > 0 && (
                      <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                        {actionItems.length} action items
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        t.processing_status === "completed" ||
                        t.processing_status === "processed"
                          ? "bg-green-50 text-green-700"
                          : t.processing_status === "processing"
                            ? "bg-blue-50 text-blue-700"
                            : t.processing_status === "failed"
                              ? "bg-red-50 text-red-700"
                              : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      {t.processing_status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Page {meta.page} of {meta.total_pages} ({meta.total} total)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 text-xs border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= (meta?.total_pages || 1)}
                className="px-3 py-1 text-xs border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MeetingsPage;
