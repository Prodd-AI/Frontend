import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  QUERY_KEY_PRIVACY,
  simulate_end_session,
  simulate_fetch_privacy,
  simulate_update_visibility,
} from "@/settings/utils/privacy.functions";
import { useState } from "react";
import {
  visibility_schema,
  type VisibilityForm,
} from "@/config/forms/privacy.form";

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-[#E5E7EB] p-6">{children}</div>
);

const RowCard = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white p-4">
    {children}
  </div>
);

const PrivacyComponent = () => {
  const query_client = useQueryClient();
  const { data } = useQuery({
    queryKey: QUERY_KEY_PRIVACY,
    queryFn: simulate_fetch_privacy,
    staleTime: 60_000,
  });

  const [visibility, set_visibility] = useState<VisibilityForm>({
    profile_photo: data?.visibility.profile_photo ?? "Everyone",
    contact_info: data?.visibility.contact_info ?? "Everyone",
    working_hours: data?.visibility.working_hours ?? "Everyone",
    activity_status: data?.visibility.activity_status ?? "Everyone",
  });

  const { mutate: update_visibility } = useMutation({
    mutationFn: simulate_update_visibility,
    onMutate: async (payload) => {
      await query_client.cancelQueries({ queryKey: QUERY_KEY_PRIVACY });
      const previous = query_client.getQueryData(QUERY_KEY_PRIVACY) as any;
      query_client.setQueryData(QUERY_KEY_PRIVACY, {
        ...previous,
        visibility: payload,
      });
      return { previous };
    },
    onError: (_e, _p, ctx) =>
      ctx?.previous &&
      query_client.setQueryData(QUERY_KEY_PRIVACY, ctx.previous),
  });

  const { mutate: end_session } = useMutation({
    mutationFn: (id: string) => simulate_end_session(id),
    onMutate: async (id) => {
      await query_client.cancelQueries({ queryKey: QUERY_KEY_PRIVACY });
      const previous = query_client.getQueryData(QUERY_KEY_PRIVACY) as any;
      const sessions = (previous?.sessions as any[]).filter((s) => s.id !== id);
      query_client.setQueryData(QUERY_KEY_PRIVACY, { ...previous, sessions });
      return { previous };
    },
    onError: (_e, _p, ctx) =>
      ctx?.previous &&
      query_client.setQueryData(QUERY_KEY_PRIVACY, ctx.previous),
  });

  const options: VisibilityOption[] = ["Everyone", "Team", "Only me"];

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
                value={(visibility as any)[row.key] as string}
                onValueChange={(v) => {
                  const next = {
                    ...visibility,
                    [row.key]: v,
                  } as VisibilityForm;
                  const parsed = visibility_schema.safeParse(next);
                  if (!parsed.success) return;
                  set_visibility(parsed.data);
                  update_visibility(parsed.data);
                }}
              >
                <SelectTrigger className="w-40 !h-9">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
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
          {data?.sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between border border-[#E5E7EB] rounded-lg p-3"
            >
              <div>
                <p className="text-sm font-semibold">{s.device}</p>
                <p className="text-xs text-gray-500">
                  {s.location}
                  {s.is_current
                    ? ""
                    : s.last_active_desc
                    ? ` • ${s.last_active_desc}`
                    : ""}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => end_session(s.id)}
                className="shadow-none border-none bg-[#F3F4F6] text-[#6B7280]"
              >
                End Session
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <p className="text-base font-semibold">Data Management</p>
        <p className="text-xs text-gray-500 mb-4">
          Export or delete your account data
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between border border-[#E5E7EB] rounded-lg p-3">
            <div>
              <p className="text-sm font-semibold">Export Data</p>
              <p className="text-xs text-gray-500">
                Download a copy of your data
              </p>
            </div>
            <Button
              variant="outline"
              className="shadow-none border-none bg-[#F3F4F6] text-[#6B7280]"
            >
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between border border-red-200 rounded-lg p-3">
            <div>
              <p className="text-sm font-semibold text-red-600">
                Delete Account
              </p>
              <p className="text-xs text-gray-500">
                Permanently delete your account and data
              </p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">Delete</Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default PrivacyComponent;
