import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  visibility_schema,
  type VisibilityForm,
} from "@/config/forms/privacy.form";
import { CurrentUserProfile, Visibility } from "@/shared/typings/team-member";
import { update_account_settings } from "@/config/services/users.service";
import {
  get_active_all_sessions,
  end_a_session,
  close_account,
} from "@/config/services/auth.service";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useAuthStore from "@/config/stores/auth.store";
import { useNavigate } from "react-router-dom";

interface PrivacyProps {
  user: CurrentUserProfile | undefined;
}

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-[#E5E7EB] p-6">{children}</div>
);

const RowCard = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white p-4">
    {children}
  </div>
);

const PrivacyComponent = ({ user }: PrivacyProps) => {
  const query_client = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const { data: sessionsData, isLoading: isLoadingSessions } = useQuery({
    queryKey: ["active-sessions"],
    queryFn: get_active_all_sessions,
  });

  const sessions = sessionsData?.data ?? [];

  const { watch: watchVisibility, setValue: setVisibilityValue } =
    useForm<VisibilityForm>({
      resolver: zodResolver(visibility_schema),
      values: user?.user_profile?.profile_visibility
        ? {
            profile_photo: user.user_profile.profile_visibility.profile_photo,
            contact_info: user.user_profile.profile_visibility.contact_info,
            working_hours: user.user_profile.profile_visibility.working_hours,
            activity_status:
              user.user_profile.profile_visibility.activity_status,
          }
        : undefined,
    });

  const visibility = watchVisibility();

  const { mutate: updateVisibility, isPending: isUpdatingVisibility } =
    useMutation({
      mutationFn: (data: VisibilityForm) =>
        update_account_settings({ profile_visibility: data }),
      onSuccess: () => {
        query_client.invalidateQueries({ queryKey: ["current-user-profile"] });
        toast.success("Visibility settings updated");
      },
 
    });

  const { mutate: endSession, isPending: isEndingSession } = useMutation({
    mutationFn: (id: string) => end_a_session(id),
    onSuccess: () => {
      query_client.invalidateQueries({ queryKey: ["active-sessions"] });
      toast.success("Session ended");
    },

  });

  const { mutate: deleteAccount, isPending: isDeletingAccount } = useMutation({
    mutationFn: close_account,
    onSuccess: () => {
      toast.success("Account deleted");
      logout();
      navigate("/login");
    },

  });

  const handleVisibilityChange = (
    key: keyof VisibilityForm,
    value: Visibility,
  ) => {
    setVisibilityValue(key, value);
    const updatedVisibility = { ...visibility, [key]: value };
    updateVisibility(updatedVisibility);
  };

  const options: { value: Visibility; label: string }[] = [
    { value: "everyone", label: "Everyone" },
    { value: "team", label: "Team" },
    { value: "only me", label: "Only me" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Section>
        <p className="text-base font-semibold">Profile Visibility</p>
        <p className="text-xs text-gray-500 mb-4">
          Control who can see your profile information
        </p>

        <div className="space-y-3">
          {(
            [
              {
                key: "profile_photo",
                title: "Profile Photo",
                desc: "Who can see your profile picture",
              },
              {
                key: "contact_info",
                title: "Contact Information",
                desc: "Who can see your email and phone",
              },
              {
                key: "working_hours",
                title: "Working Hours",
                desc: "Who can see your availability",
              },
              {
                key: "activity_status",
                title: "Activity Status",
                desc: "Show when you're online or offline",
              },
            ] as const
          ).map((row) => (
            <RowCard key={row.key}>
              <div>
                <p className="text-sm font-semibold">{row.title}</p>
                <p className="text-xs text-gray-500">{row.desc}</p>
              </div>
              <Select
                value={visibility[row.key]}
                disabled={isUpdatingVisibility}
                onValueChange={(v: Visibility) =>
                  handleVisibilityChange(row.key, v)
                }
              >
                <SelectTrigger className="w-40 !h-9">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </RowCard>
          ))}
        </div>
      </Section>

      <Section>
        <p className="text-base font-semibold">Active Sessions</p>
        <p className="text-xs text-gray-500 mb-4">
          Manage your active login sessions
        </p>

        <div className="space-y-3">
          {isLoadingSessions ? (
            <p className="text-sm text-gray-500">Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-gray-500">No active sessions</p>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between border border-[#E5E7EB] rounded-lg p-3"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {s.device_info || "Unknown Device"}
                    {s.is_current && (
                      <span className="ml-2 text-xs text-green-600 font-normal">
                        (Current)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {formatDate(s.created_at)}
                  </p>
                </div>
                {!s.is_current && (
                  <Button
                    variant="outline"
                    onClick={() => endSession(s.id)}
                    disabled={isEndingSession}
                    className="shadow-none border-none bg-[#F3F4F6] text-[#6B7280]"
                  >
                    End Session
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </Section>

      <Section>
        <p className="text-base font-semibold">Data Management</p>
        <p className="text-xs text-gray-500 mb-4">Delete your account data</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between border border-red-200 rounded-lg p-3">
            <div>
              <p className="text-sm font-semibold text-red-600">
                Delete Account
              </p>
              <p className="text-xs text-gray-500">
                Permanently delete your account and data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteAccount()}
                    disabled={isDeletingAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeletingAccount ? "Deleting..." : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default PrivacyComponent;
