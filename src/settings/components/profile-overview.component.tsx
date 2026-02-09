import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profile_form_schema,
  type ProfileForm,
} from "@/config/forms/profile.form";
import { update_user } from "@/config/services/users.service";
import { uploadProfileImage } from "@/config/services/upload.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CiUser } from "react-icons/ci";
import { PiCameraLight } from "react-icons/pi";
import { toast } from "sonner";
import { CurrentUserProfile } from "@/shared/typings/team-member";

interface ProfileOverviewProps {
  user: CurrentUserProfile | undefined;
}

const ProfileOverviewComponent = ({ user }: ProfileOverviewProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profile_form_schema),
    values: user
      ? {
          first_name: user.first_name ?? "",
          last_name: user.last_name ?? "",
          job_title: user.user_profile.job_title ?? "",
          bio_description: user.user_profile.bio_description ?? "",
          avatar_url: user.avatar_url ?? "",
        }
      : undefined,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: ProfileForm) => update_user(payload),
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
  });

  const on_submit = (data: ProfileForm) => {
    mutate(data);
  };

  const { mutate: uploadAvatar, isPending: isUploading } = useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
    onSuccess: (response) => {
      setValue("avatar_url", response.data.url);
      toast.success("Avatar uploaded successfully");
    },
  });

  const handle_avatar_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAvatar(file);
  };

  const avatar_url = watch("avatar_url");

  return (
    <div className="rounded-xl p-6 border border-[#E5E7EB]">
      <div className="mb-6">
        <p className="text-lg font-semibold">Profile Information</p>
        <p className="text-xs text-gray-500">
          Update your personal information and profile details
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="size-20 rounded-full bg-[#F3F4F6] flex items-center justify-center overflow-hidden">
            {isUploading ? (
              <div className="size-20 flex items-center justify-center bg-gray-200">
                <div className="size-5 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : avatar_url ? (
              <img
                src={avatar_url}
                className="size-20 object-cover"
                alt="Avatar"
              />
            ) : (
              <CiUser size={28} color="var(--primary-color)" />
            )}
          </div>
          <label
            className={`absolute -bottom-1 -right-1 inline-flex items-center justify-center size-7 rounded-full bg-[var(--primary-color)] text-white shadow ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handle_avatar_change}
              disabled={isUploading}
            />
            <PiCameraLight />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit(on_submit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              First Name
            </Label>
            <Input
              className="h-12 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
              {...register("first_name")}
              placeholder="John"
            />
            {errors.first_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              Last Name
            </Label>
            <Input
              className="h-12 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
              {...register("last_name")}
              placeholder="Smith"
            />
            {errors.last_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
            Email
          </Label>
          <Input
            className="h-12 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 bg-gray-50 text-gray-500 cursor-not-allowed"
            type="email"
            value={user?.email ?? ""}
            disabled
            placeholder="john.smith@company.com"
          />
        </div>

        <div className="flex flex-col">
          <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
            Job Title
          </Label>
          <Input
            className="h-12 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
            {...register("job_title")}
            placeholder="Senior Software Engineer"
          />
        </div>

        <div className="flex flex-col">
          <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
            Bio
          </Label>
          <Textarea
            className="rounded-lg border-[#E5E7EB] h-40 placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
            {...register("bio_description")}
            placeholder="Tell us about yourself..."
            rows={10}
          />
          {errors.bio_description && (
            <p className="text-xs text-red-500 mt-1">
              {errors.bio_description.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 rounded-md bg-gradient-to-r from-[#6D28D9] to-[#2563EB] py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default ProfileOverviewComponent;
