import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Using shadcn Input time variant per docs
import { useState } from "react";
import {
  notifications_schema,
  type NotificationsForm,
  working_hours_schema,
  type WorkingHoursForm,
} from "@/config/forms/preferences.form";
import {
  QUERY_KEY_PREFERENCES,
  simulate_fetch_preferences,
  simulate_update_notifications,
  simulate_update_working_hours,
} from "@/settings/utils/preferences.functions";

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-[#E5E7EB] p-6">{children}</div>
);

const RowCard = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white p-4">
    {children}
  </div>
);

const PreferencesComponent = () => {
  const query_client = useQueryClient();
  const { data } = useQuery({
    queryKey: QUERY_KEY_PREFERENCES,
    queryFn: simulate_fetch_preferences,
    staleTime: 60_000,
  });

  const [notifications, set_notifications] = useState<NotificationsForm>({
    email: data?.notifications.email ?? true,
    push: data?.notifications.push ?? false,
    in_app: data?.notifications.in_app ?? false,
    task_reminders: data?.notifications.task_reminders ?? false,
    team_updates: data?.notifications.team_updates ?? false,
  });

  const [working_hours, set_working_hours] = useState<WorkingHoursForm>({
    start_time: data?.working_hours.start_time ?? "09:00",
    end_time: data?.working_hours.end_time ?? "17:00",
    time_zone: data?.working_hours.time_zone ?? "West African Time",
    availability: data?.working_hours.availability ?? "Available",
  });

  const { mutate: update_notifications } = useMutation({
    mutationFn: simulate_update_notifications,
    onMutate: async (payload) => {
      await query_client.cancelQueries({ queryKey: QUERY_KEY_PREFERENCES });
      const previous = query_client.getQueryData(QUERY_KEY_PREFERENCES) as any;
      query_client.setQueryData(QUERY_KEY_PREFERENCES, {
        ...previous,
        notifications: payload,
      });
      return { previous };
    },
    onError: (_e, _p, ctx) =>
      ctx?.previous &&
      query_client.setQueryData(QUERY_KEY_PREFERENCES, ctx.previous),
  });

  const { mutate: update_hours } = useMutation({
    mutationFn: simulate_update_working_hours,
    onMutate: async (payload) => {
      await query_client.cancelQueries({ queryKey: QUERY_KEY_PREFERENCES });
      const previous = query_client.getQueryData(QUERY_KEY_PREFERENCES) as any;
      query_client.setQueryData(QUERY_KEY_PREFERENCES, {
        ...previous,
        working_hours: payload,
      });
      return { previous };
    },
    onError: (_e, _p, ctx) =>
      ctx?.previous &&
      query_client.setQueryData(QUERY_KEY_PREFERENCES, ctx.previous),
  });

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
                key: "email",
                title: "Email Notifications",
                desc: "Receive updates via email",
              },
              {
                key: "push",
                title: "Push Notifications",
                desc: "Get notified on your device",
              },
              {
                key: "in_app",
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
                checked={Boolean((notifications as any)[row.key])}
                onCheckedChange={(checked) => {
                  const next = {
                    ...notifications,
                    [row.key]: Boolean(checked),
                  } as NotificationsForm;
                  const parsed = notifications_schema.safeParse(next);
                  if (!parsed.success) return;
                  set_notifications(parsed.data);
                  update_notifications(parsed.data);
                }}
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
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              Start Time
            </Label>
            <Input
              type="time"
              className="h-11 rounded-lg border-[#E5E7EB] bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
              value={working_hours.start_time}
              onChange={(e) => {
                const next = { ...working_hours, start_time: e.target.value };
                const parsed = working_hours_schema.safeParse(next);
                if (!parsed.success) return;
                set_working_hours(parsed.data);
                update_hours(parsed.data);
              }}
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              End Time
            </Label>
            <Input
              type="time"
              className="h-11 rounded-lg border-[#E5E7EB] bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
              value={working_hours.end_time}
              onChange={(e) => {
                const next = { ...working_hours, end_time: e.target.value };
                const parsed = working_hours_schema.safeParse(next);
                if (!parsed.success) return;
                set_working_hours(parsed.data);
                update_hours(parsed.data);
              }}
            />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              Time Zone
            </Label>
            <Select
              value={working_hours.time_zone}
              onValueChange={(v) => {
                const next = { ...working_hours, time_zone: v };
                const parsed = working_hours_schema.safeParse(next);
                if (!parsed.success) return;
                set_working_hours(parsed.data);
                update_hours(parsed.data);
              }}
            >
              <SelectTrigger className="w-full !h-11">
                <SelectValue placeholder="Select time zone" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {[
                  "West African Time",
                  "UTC",
                  "Central European Time",
                  "Eastern Time",
                ].map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
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
              value={working_hours.availability}
              onValueChange={(v: any) => {
                const next = { ...working_hours, availability: v };
                const parsed = working_hours_schema.safeParse(next);
                if (!parsed.success) return;
                set_working_hours(parsed.data);
                update_hours(parsed.data);
              }}
            >
              <SelectTrigger className="w-full !h-11">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {(["Available", "Busy", "Away"] as const).map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
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
