import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  password_update_schema,
  type PasswordUpdateForm,
} from "@/config/forms/account-settings.form";
import { change_password } from "@/config/services/auth.service";
import { update_account_settings } from "@/config/services/users.service";
import { CurrentUserProfile } from "@/shared/typings/team-member";
import { toast } from "sonner";

interface AccountSettingsProps {
  user: CurrentUserProfile | undefined;
}

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-[#E5E7EB] p-6">{children}</div>
);

const AccountSettingsComponent = ({ user }: AccountSettingsProps) => {
  const query_client = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordUpdateForm>({
    resolver: zodResolver(password_update_schema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const mfaEnabled = user?.user_profile?.mfa_enabled ?? false;

  const { mutate: updatePassword, isPending: isUpdatingPassword } = useMutation(
    {
      mutationFn: (data: PasswordUpdateForm) => change_password(data),
      onSuccess: () => {
        toast.success("Password updated successfully");
        reset();
      },
    },
  );

  const { mutate: updateMfa, isPending: isUpdatingMfa } = useMutation({
    mutationFn: (enabled: boolean) =>
      update_account_settings({ mfa_enabled: enabled }),
    onSuccess: () => {
      query_client.invalidateQueries({ queryKey: ["current-user-profile"] });
      toast.success("Two-factor authentication updated");
    },
  });

  const onSubmitPassword = (data: PasswordUpdateForm) => {
    updatePassword(data);
  };

  return (
    <div className="flex flex-col gap-6">
      <Section>
        <p className="text-base font-semibold">Account Security</p>
        <p className="text-xs text-gray-500 mb-4">
          Manage your password and security settings
        </p>

        <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              Current Password
            </Label>
            <Input
              type="password"
              className="h-11 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
              {...register("current_password")}
            />
            {errors.current_password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.current_password.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              New Password
            </Label>
            <Input
              type="password"
              className="h-11 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
              {...register("new_password")}
            />
            {errors.new_password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.new_password.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              Confirm New Password
            </Label>
            <Input
              type="password"
              className="h-11 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
              {...register("confirm_password")}
            />
            {errors.confirm_password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isUpdatingPassword}
            className="h-10 bg-[var(--primary-color)]"
          >
            {isUpdatingPassword ? "Updating..." : "Update Password"}
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
            checked={mfaEnabled}
            onCheckedChange={(checked) => updateMfa(checked)}
            disabled={isUpdatingMfa}
          />
        </div>
      </Section>
      {/* <Section>
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
      </Section> */}
    </div>
  );
};

export default AccountSettingsComponent;
