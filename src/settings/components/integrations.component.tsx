import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  connect_integration,
  disconnect_integration,
  get_integration_status,
  sync_meetings,
} from "@/config/services/integrations.service";
import { toast } from "sonner";
import { IoFlash, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { VscLoading } from "react-icons/vsc";
import { FiExternalLink } from "react-icons/fi";

function IntegrationsComponent() {
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const { data: statusResponse, isLoading: statusLoading } = useQuery({
    queryKey: ["integration-status"],
    queryFn: get_integration_status,
  });

  const status = statusResponse?.data;
  const isConnected = status?.fireflies === "connected";
  const hasError = status?.fireflies === "error";

  const connectMutation = useMutation({
    mutationFn: () =>
      connect_integration({ provider: "fireflies", api_key: apiKey }),
    onSuccess: () => {
      toast.success("Fireflies connected successfully!");
      queryClient.invalidateQueries({ queryKey: ["integration-status"] });
      setApiKey("");
      setShowKeyInput(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to connect");
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => disconnect_integration({ provider: "fireflies" }),
    onSuccess: () => {
      toast.success("Fireflies disconnected");
      queryClient.invalidateQueries({ queryKey: ["integration-status"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to disconnect");
    },
  });

  const syncMutation = useMutation({
    mutationFn: sync_meetings,
    onSuccess: (res) => {
      toast.success(
        `Synced ${res.data.synced} meeting(s), ${res.data.skipped_duplicates} skipped.`,
      );
      queryClient.invalidateQueries({ queryKey: ["transcripts"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Sync failed");
    },
  });

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <VscLoading className="animate-spin text-2xl text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Meeting Integrations
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Connect your meeting platforms to automatically sync transcripts and
          generate actionable tasks.
        </p>
      </div>

      {/* Fireflies Card */}
      <div className="border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <IoFlash className="text-white text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Fireflies.ai</h4>
              <p className="text-sm text-gray-500">
                AI meeting transcription &amp; intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                <IoCheckmarkCircle />
                Connected
              </span>
            ) : hasError ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
                <IoCloseCircle />
                Error
              </span>
            ) : (
              <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                Not Connected
              </span>
            )}
          </div>
        </div>

        {/* Capabilities */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Transcripts",
            "AI Summaries",
            "Action Items",
            "Smart Mapping",
          ].map((cap) => (
            <span
              key={cap}
              className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md"
            >
              {cap}
            </span>
          ))}
        </div>

        {/* Action Area */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-color rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {syncMutation.isPending && (
                  <VscLoading className="animate-spin" />
                )}
                Sync Meetings
              </button>
              <button
                onClick={() => disconnectMutation.mutate()}
                disabled={disconnectMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                Disconnect
              </button>
              <a
                href="https://app.fireflies.ai"
                target="_blank"
                rel="noreferrer"
                className="ml-auto text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                Open Fireflies <FiExternalLink />
              </a>
            </div>
          ) : showKeyInput ? (
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fireflies API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Fireflies API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                />
                <a
                  href="https://app.fireflies.ai/integrations/custom/fireflies"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary-color hover:underline mt-1 inline-flex items-center gap-1"
                >
                  Get your API key <FiExternalLink size={10} />
                </a>
              </div>
              <button
                onClick={() => connectMutation.mutate()}
                disabled={!apiKey || connectMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-color rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {connectMutation.isPending && (
                  <VscLoading className="animate-spin" />
                )}
                Connect
              </button>
              <button
                onClick={() => setShowKeyInput(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowKeyInput(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-color rounded-lg hover:opacity-90 transition-opacity"
            >
              Connect Fireflies
            </button>
          )}
        </div>
      </div>

      {/* Future Integrations Teaser */}
      <div className="border border-dashed border-gray-200 rounded-2xl p-6">
        <h4 className="font-medium text-gray-500 text-sm">Coming Soon</h4>
        <div className="flex gap-4 mt-3">
          {["Zoom", "Google Meet", "Microsoft Teams", "Slack"].map(
            (platform) => (
              <span
                key={platform}
                className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-md"
              >
                {platform}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default IntegrationsComponent;
