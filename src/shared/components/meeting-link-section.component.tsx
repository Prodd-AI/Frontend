import { useState } from "react";
import { useGoogleLogin, useGoogleOAuth } from "@react-oauth/google";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Link2, Video } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import googleIcon from "@/assets/svgs/devicon_google.svg";
import {
  connect_google_meet_account,
  create_google_meet_space,
  get_google_meet_connection_status,
} from "@/config/services/google-meet.service";
import { cn } from "@/lib/utils";

export type MeetingLinkMode = "manual" | "google_meet";

export type MeetingPlatform =
  | "zoom"
  | "teams"
  | "google_meet"
  | "webex"
  | "other";

const GOOGLE_MEET_SCOPE =
  "https://www.googleapis.com/auth/meetings.space.created";

const PLATFORM_PLACEHOLDERS: Record<MeetingPlatform, string> = {
  zoom: "https://zoom.us/j/...",
  teams: "https://teams.microsoft.com/l/meetup-join/...",
  google_meet: "https://meet.google.com/...",
  webex: "https://company.webex.com/meet/...",
  other: "https://...",
};

interface MeetingLinkSectionProps {
  mode: MeetingLinkMode;
  onModeChange: (mode: MeetingLinkMode) => void;
  meetingLink: string;
  onMeetingLinkChange: (link: string) => void;
  error?: string;
  userEmail?: string;
}

interface GoogleMeetPanelProps {
  meetingLink: string;
  onMeetingLinkChange: (link: string) => void;
  userEmail?: string;
}

function GoogleMeetPanel({
  meetingLink,
  onMeetingLinkChange,
  userEmail,
}: GoogleMeetPanelProps) {
  const queryClient = useQueryClient();
  const { scriptLoadedSuccessfully } = useGoogleOAuth();

  const { data: connectionStatus, isLoading: isStatusLoading } = useQuery({
    queryKey: ["google-meet-connection"],
    queryFn: async () => {
      const response = await get_google_meet_connection_status();
      return response.data;
    },
    retry: false,
  });

  const { mutate: connectAccount, isPending: isConnecting } = useMutation({
    mutationFn: connect_google_meet_account,
    onSuccess: (response) => {
      queryClient.setQueryData(["google-meet-connection"], response.data);
      toast.success(
        response.data.google_email
          ? `Connected ${response.data.google_email} for Google Meet`
          : "Google account connected for Meet",
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to connect Google account");
    },
  });

  const { mutate: generateMeetLink, isPending: isGenerating } = useMutation({
    mutationFn: create_google_meet_space,
    onSuccess: (response) => {
      const uri = response.data.meeting_uri;
      if (!uri) {
        toast.error("No meeting link returned. Please try again.");
        return;
      }
      onMeetingLinkChange(uri);
      toast.success("Google Meet link generated");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to generate Google Meet link");
    },
  });

  const startGoogleConnect = useGoogleLogin({
    flow: "auth-code",
    scope: GOOGLE_MEET_SCOPE,
    onSuccess: ({ code }) => {
      if (!code) {
        toast.error("Google authorization failed. Please try again.");
        return;
      }
      connectAccount({ code });
    },
    onError: () => {
      toast.error("Google authorization was cancelled or failed.");
    },
  });

  const isConnected = connectionStatus?.connected === true;
  const connectedEmail = connectionStatus?.google_email;

  if (isStatusLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground rounded-xl border border-gray-200/60 bg-gray-50/50 p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking Google connection...
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="space-y-3 rounded-xl border border-gray-200/60 bg-gray-50/50 p-4">
        <p className="text-sm text-muted-foreground">
          Connect a Google account to auto-generate Meet links.
          {userEmail && !userEmail.endsWith("@gmail.com") && (
            <>
              {" "}
              Your login is{" "}
              <span className="font-medium text-foreground">{userEmail}</span>
              — you can connect a separate Gmail account (e.g. your personal
              Google account).
            </>
          )}
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={!scriptLoadedSuccessfully || isConnecting}
          onClick={() => startGoogleConnect()}
          className="h-11 rounded-xl gap-2"
        >
          {isConnecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <img
              src={googleIcon}
              alt=""
              className="h-4 w-4"
              aria-hidden="true"
            />
          )}
          Connect Google Account
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-gray-200/60 bg-gray-50/50 p-4">
      <p className="text-sm text-muted-foreground">
        Connected as{" "}
        <span className="font-medium text-foreground">{connectedEmail}</span>.{" "}
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={() => startGoogleConnect()}
        >
          Use a different account
        </button>
      </p>

      <Button
        type="button"
        variant="outline"
        disabled={isGenerating}
        onClick={() => generateMeetLink()}
        className="h-11 rounded-xl gap-2 w-full sm:w-auto"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Video className="h-4 w-4" />
        )}
        {meetingLink ? "Regenerate link" : "Generate Google Meet link"}
      </Button>

      {meetingLink ? (
        <Input
          value={meetingLink}
          readOnly
          className="h-12 bg-white border border-gray-200/60 rounded-xl text-sm text-foreground"
        />
      ) : null}
    </div>
  );
}

function MeetingLinkSection({
  mode,
  onModeChange,
  meetingLink,
  onMeetingLinkChange,
  error,
  userEmail,
}: MeetingLinkSectionProps) {
  const [platform, setPlatform] = useState<MeetingPlatform>("zoom");
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">
        Meeting Link <span className="text-destructive">*</span>
      </Label>

      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/80 rounded-xl">
        <button
          type="button"
          onClick={() => onModeChange("manual")}
          className={cn(
            "flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium transition-all",
            mode === "manual"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Link2 className="h-4 w-4" />
          Enter link
        </button>
        <button
          type="button"
          onClick={() => onModeChange("google_meet")}
          className={cn(
            "flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium transition-all",
            mode === "google_meet"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <img src={googleIcon} alt="" className="h-4 w-4" aria-hidden="true" />
          Google Meet
        </button>
      </div>

      {mode === "manual" ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Platform
            </Label>
            <Select
              value={platform}
              onValueChange={(value) =>
                setPlatform(value as MeetingPlatform)
              }
            >
              <SelectTrigger className="h-11 bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200/80 rounded-xl shadow-lg">
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="teams">Microsoft Teams</SelectItem>
                <SelectItem value="google_meet">Google Meet</SelectItem>
                <SelectItem value="webex">Webex</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            value={meetingLink}
            onChange={(event) => onMeetingLinkChange(event.target.value)}
            placeholder={PLATFORM_PLACEHOLDERS[platform]}
            className="h-12 bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm placeholder:text-muted-foreground/50 transition-all duration-200 focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
          />
        </div>
      ) : googleClientId ? (
        <GoogleMeetPanel
          meetingLink={meetingLink}
          onMeetingLinkChange={onMeetingLinkChange}
          userEmail={userEmail}
        />
      ) : (
        <p className="text-sm text-muted-foreground rounded-xl border border-gray-200/60 bg-gray-50/50 p-4">
          Google Meet is not configured. Add{" "}
          <code className="text-xs">VITE_GOOGLE_CLIENT_ID</code> or enter a
          link manually.
        </p>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

export default MeetingLinkSection;