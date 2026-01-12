import { useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlinePhotoCamera } from "react-icons/md";
import ProfilePictureUploadModal from "@/shared/components/profile-picture-upload-modal.component";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import { TeamLeadOnboardingForm } from "@/onboarding/schemas/team-lead.schema";
import { TimePicker } from "@/components/ui/time-picker";
import { TimezoneSelect } from "@/components/ui/timezone-select";

interface SetupProfileProps {
  form: UseFormReturn<TeamLeadOnboardingForm>;
}

function SetupProfile({ form }: SetupProfileProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, setValue, watch } = form;
  const profilePictureUrl = watch("avatar_url") ?? "";

  const handleUploadSuccess = (imageUrl: string) => {
    setValue("avatar_url", imageUrl, { shouldValidate: true });
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col">
        <div
          className="size-[64px] flex justify-center items-center bg-[#F3F4F6] rounded-full relative cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsModalOpen(true);
            }
          }}
          aria-label="Upload profile picture"
        >
          {profilePictureUrl ? (
            <img
              src={profilePictureUrl}
              alt="Profile"
              className="size-full object-cover rounded-full"
            />
          ) : (
            <FaRegUser size={28} className="text-[#6619DE]" />
          )}
          <div className="absolute size-[18px] bg-linear-to-br from-[rgb(102,25,222)] to-[#1186DA] bottom-[2px] rounded-full right-[2px] flex justify-center items-center">
            <MdOutlinePhotoCamera className="text-white" size={12} />
          </div>
        </div>

        <form className="w-full flex gap-4 flex-col mt-9">
          <div className="flex gap-5 flex-col sm:flex-row">
            <div className="flex-1">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                type="text"
                id="first_name"
                className="mt-2 h-[55px]"
                {...register("first_name")}
              />
              {form.formState.errors.first_name && (
                <div className="text-red-500 text-xs mt-1">
                  {form.formState.errors.first_name.message}
                </div>
              )}
            </div>
            <div className="flex-1">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                type="text"
                id="last_name"
                className="mt-2 h-[55px]"
                {...register("last_name")}
              />
              {form.formState.errors.last_name && (
                <div className="text-red-500 text-xs mt-1">
                  {form.formState.errors.last_name.message}
                </div>
              )}
            </div>
          </div>
          <div className="mt-2">
            <Label htmlFor="team_name_and_role">Team Name/Role</Label>
            <div className="relative mt-2">
              <input
                type="text"
                id="team_name_and_role"
                className="flex h-[55px] w-full rounded-md border border-input bg-[#F3F4F6] pl-3 pr-10 py-2 text-base text-[#6B7280] font-semibold ring-offset-background disabled:cursor-not-allowed md:text-sm"
                disabled
               value={"Team Lead"}
                readOnly
              />
              <GiPadlock className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            </div>
          </div>
          <div className="mt-2">
            <Label>Timezone</Label>
            <TimezoneSelect value={watch("timezone")} />
          </div>
          <div className="mt-2">
            <Label>Work Hours</Label>
            <div className="flex gap-4 mt-2">
              <TimePicker
                value={watch("start_work_hour")}
                onChange={(time) =>
                  setValue("start_work_hour", time, { shouldValidate: true })
                }
                placeholder="Start time"
                className="flex-1"
              />
              <TimePicker
                value={watch("end_work_hour")}
                onChange={(time) =>
                  setValue("end_work_hour", time, { shouldValidate: true })
                }
                placeholder="End time"
                className="flex-1"
              />
            </div>
          </div>
        </form>
      </div>

      <ProfilePictureUploadModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
}

export default SetupProfile;
