import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  notifications_schema,
  type NotificationsForm,
  working_hours_schema,
  type WorkingHoursForm,
} from "@/config/forms/preferences.form";
import { update_account_settings } from "@/config/services/users.service";
import { CurrentUserProfile } from "@/shared/typings/team-member";
import { COMMON_TIMEZONES } from "@/shared/utils/constants";
import { toast } from "sonner";

interface PreferencesProps {
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

const PreferencesComponent = ({ user }: PreferencesProps) => {
  const query_client = useQueryClient();

  const { watch: watchNotifications, setValue: setNotificationValue } =
    useForm<NotificationsForm>({
      resolver: zodResolver(notifications_schema),
      values: user?.user_profile?.notification_setting
        ? {
            email_notifications:
              user.user_profile.notification_setting.email_notifications ??
              true,
            push_notifications:
              user.user_profile.notification_setting.push_notifications ??
              false,
            in_app_notifications:
              user.user_profile.notification_setting.in_app_notifications ??
              false,
            task_reminders:
              user.user_profile.notification_setting.task_reminders ?? false,
            team_updates:
              user.user_profile.notification_setting.team_updates ?? false,
          }
        : undefined,
    });

  const { watch: watchWorkingHours, setValue: setWorkingHoursValue } =
    useForm<WorkingHoursForm>({
      resolver: zodResolver(working_hours_schema),
      values: user?.user_profile?.working_hours
        ? {
            start_time: user.user_profile.working_hours.start_time ?? "9:00 AM",
            end_time: user.user_profile.working_hours.end_time ?? "5:00 PM",
            timezone:
              user.user_profile.working_hours.timezone ?? "Africa/Lagos",
            availability_status:
              user.user_profile.working_hours.availability_status ??
              "available",
          }
        : undefined,
    });

  const notifications = watchNotifications();
  const working_hours = watchWorkingHours();

  const { mutate: updateNotifications, isPending: isUpdatingNotifications } =
    useMutation({
      mutationFn: (data: NotificationsForm) =>
        update_account_settings({ notification_setting: data }),
      onSuccess: () => {
        query_client.invalidateQueries({ queryKey: ["current-user-profile"] });
        toast.success("Notification settings updated");
      },
    });

  const { mutate: updateWorkingHours, isPending: isUpdatingWorkingHours } =
    useMutation({
      mutationFn: (data: WorkingHoursForm) =>
        update_account_settings({ working_hours: data }),
      onSuccess: () => {
        query_client.invalidateQueries({ queryKey: ["current-user-profile"] });
        toast.success("Working hours updated");
      },
    });

  const handleNotificationChange = (
    key: keyof NotificationsForm,
    checked: boolean,
  ) => {
    setNotificationValue(key, checked);
    const updatedNotifications = { ...notifications, [key]: checked };
    updateNotifications(updatedNotifications);
  };

  const handleWorkingHoursChange = (
    key: keyof WorkingHoursForm,
    value: WorkingHoursForm[keyof WorkingHoursForm],
  ) => {
    setWorkingHoursValue(key, value);
    const updatedWorkingHours = { ...working_hours, [key]: value };
    updateWorkingHours(updatedWorkingHours as WorkingHoursForm);
  };

  return (
    <div className="flex flex-col gap-6">
      <Section>
        <p className="text-base font-semibold">Notifications</p>
        <p className="text-xs text-gray-500 mb-4">
          Choose how you want to be notified
        </p>

        <div className="space-y-3">
          {(
            [
              {
                key: "email_notifications",
                title: "Email Notifications",
                desc: "Receive updates via email",
              },
              {
                key: "push_notifications",
                title: "Push Notifications",
                desc: "Get notified on your device",
              },
              {
                key: "in_app_notifications",
                title: "In-App Notifications",
                desc: "See notifications within the app",
              },
              {
                key: "task_reminders",
                title: "Task Reminders",
                desc: "Get reminded about upcoming tasks",
              },
              {
                key: "team_updates",
                title: "Team Updates",
                desc: "Stay updated on team activities",
              },
            ] as const
          ).map((row) => (
            <RowCard key={row.key}>
              <div>
                <p className="text-sm font-semibold">{row.title}</p>
                <p className="text-xs text-gray-500">{row.desc}</p>
              </div>
              <Switch
                checked={Boolean(notifications[row.key])}
                disabled={isUpdatingNotifications}
                onCheckedChange={(checked) =>
                  handleNotificationChange(row.key, checked)
                }
              />
            </RowCard>
          ))}
        </div>
      </Section>

      <Section>
        <p className="text-base font-semibold">Working Hours</p>
        <p className="text-xs text-gray-500 mb-4">
          Set your availability and time zone
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <TimePicker
            label="Start Time"
            value={working_hours.start_time}
            onChange={(value) => handleWorkingHoursChange("start_time", value)}
          />
          <TimePicker
            label="End Time"
            value={working_hours.end_time}
            onChange={(value) => handleWorkingHoursChange("end_time", value)}
          />
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              Time Zone
            </Label>
            <Select
              value={working_hours.timezone}
              disabled={isUpdatingWorkingHours}
              onValueChange={(v) => handleWorkingHoursChange("timezone", v)}
            >
              <SelectTrigger className="w-full !h-11">
                <SelectValue placeholder="Select time zone" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {COMMON_TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              Availability Status
            </Label>
            <Select
              value={working_hours.availability_status}
              disabled={isUpdatingWorkingHours}
              onValueChange={(v: "available" | "busy" | "away") =>
                handleWorkingHoursChange("availability_status", v)
              }
            >
              <SelectTrigger className="w-full !h-11">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {(
                  [
                    { value: "available", label: "Available" },
                    { value: "busy", label: "Busy" },
                    { value: "away", label: "Away" },
                  ] as const
                ).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default PreferencesComponent;
