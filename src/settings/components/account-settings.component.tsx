import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {
  password_update_schema,
  type PasswordUpdateForm,
  type TwoFactorForm,
} from "@/config/forms/account-settings.form";
import {
  QUERY_KEY_ACCOUNT_SETTINGS,
  simulate_fetch_account_settings,
  simulate_update_password,
  simulate_update_two_factor,
  simulate_toggle_app,
} from "@/settings/utils/account-settings.functions";

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-[#E5E7EB] p-6">{children}</div>
);

const AccountSettingsComponent = () => {
  const query_client = useQueryClient();
  const { data } = useQuery({
    queryKey: QUERY_KEY_ACCOUNT_SETTINGS,
    queryFn: simulate_fetch_account_settings,
    staleTime: 60_000,
  });

  const [password_form, set_password_form] = useState<PasswordUpdateForm>({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [two_factor, set_two_factor] = useState<TwoFactorForm>({
    enabled: data?.two_factor.enabled ?? false,
  });

  const { mutate: update_password, isPending: is_updating_password } =
    useMutation({
      mutationFn: simulate_update_password,
    });

  const { mutate: update_two_factor, isPending: is_updating_2fa } = useMutation(
    {
      mutationFn: simulate_update_two_factor,
      onMutate: async (payload) => {
        await query_client.cancelQueries({
          queryKey: QUERY_KEY_ACCOUNT_SETTINGS,
        });
        const previous = query_client.getQueryData(
          QUERY_KEY_ACCOUNT_SETTINGS
        ) as any;
        query_client.setQueryData(QUERY_KEY_ACCOUNT_SETTINGS, {
          ...previous,
          two_factor: { enabled: payload.enabled },
        });
        return { previous };
      },
      onError: (_err, _payload, ctx) => {
        if (ctx?.previous)
          query_client.setQueryData(QUERY_KEY_ACCOUNT_SETTINGS, ctx.previous);
      },
    }
  );

  const { mutate: toggle_app } = useMutation({
    mutationFn: ({ id, connect }: { id: string; connect: boolean }) =>
      simulate_toggle_app(id, connect),
    onMutate: async ({ id, connect }) => {
      await query_client.cancelQueries({
        queryKey: QUERY_KEY_ACCOUNT_SETTINGS,
      });
      const previous = query_client.getQueryData(
        QUERY_KEY_ACCOUNT_SETTINGS
      ) as any;
      const apps = (previous?.apps as ConnectedApp[]).map((a) =>
        a.id === id
          ? { ...a, status: connect ? "connected" : "disconnected" }
          : a
      );
      query_client.setQueryData(QUERY_KEY_ACCOUNT_SETTINGS, {
        ...previous,
        apps,
      });
      return { previous };
    },
    onError: (_e, _p, ctx) =>
      ctx?.previous &&
      query_client.setQueryData(QUERY_KEY_ACCOUNT_SETTINGS, ctx.previous),
  });

  const on_submit_password = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = password_update_schema.safeParse(password_form);
    if (!parsed.success) return;
    update_password(parsed.data);
  };

  return (
    <div className="flex flex-col gap-6">
      <Section>
        <p className="text-base font-semibold">Account Security</p>
        <p className="text-xs text-gray-500 mb-4">
          Manage your password and security settings
        </p>

        <form onSubmit={on_submit_password} className="space-y-4">
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              Current Password
            </Label>
            <Input
              type="password"
              className="h-11 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
              value={password_form.current_password}
              onChange={(e) =>
                set_password_form((p) => ({
                  ...p,
                  current_password: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              New Password
            </Label>
            <Input
              type="password"
              className="h-11 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
              value={password_form.new_password}
              onChange={(e) =>
                set_password_form((p) => ({
                  ...p,
                  new_password: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              Confirm New Password
            </Label>
            <Input
              type="password"
              className="h-11 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
              value={password_form.confirm_new_password}
              onChange={(e) =>
                set_password_form((p) => ({
                  ...p,
                  confirm_new_password: e.target.value,
                }))
              }
            />
          </div>

          <Button
            disabled={is_updating_password}
            className="h-10 bg-[var(--primary-color)]"
          >
            Update Password
          </Button>
        </form>
      </Section>

      <Section>
        <p className="text-base font-semibold">Two-Factor Authentication</p>
        <p className="text-xs text-gray-500 mb-4">
          Add an extra layer of security to your account
        </p>

        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] p-4">
          <div>
            <p className="text-sm font-semibold">Two-Factor Authentication</p>
            <p className="text-xs text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch
            checked={two_factor.enabled}
            onCheckedChange={(checked) => {
              set_two_factor({ enabled: Boolean(checked) });
              update_two_factor({ enabled: Boolean(checked) });
            }}
            disabled={is_updating_2fa}
          />
        </div>
      </Section>

      <Section>
        <p className="text-base font-semibold">Connected Apps</p>
        <p className="text-xs text-gray-500 mb-4">
          Manage your external integrations
        </p>

        <div className="space-y-3">
          {data?.apps.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between border border-[#E5E7EB] rounded-lg p-3"
            >
              <div>
                <p className="text-sm font-semibold">{app.name}</p>
                <p
                  className={`text-xs ${
                    app.status === "connected"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {app.status === "connected" ? "Connected" : "Disconnected"}
                </p>
              </div>
              {app.status === "connected" ? (
                <Button
                  variant="outline"
                  onClick={() => toggle_app({ id: app.id, connect: false })}
                  className="bg-[#F3F4F6] text-[#6B7280] shadow-none border-none"
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  className="bg-[var(--primary-color)]"
                  onClick={() => toggle_app({ id: app.id, connect: true })}
                >
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default AccountSettingsComponent;
