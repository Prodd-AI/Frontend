import { useState } from "react";
import { RiUserLine } from "react-icons/ri";
import { MdOutlinePhotoCamera } from "react-icons/md";
import ProfilePictureUploadModal from "@/shared/components/profile-picture-upload-modal.component";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GiPadlock } from "react-icons/gi";

const QuickSetupComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("");
  const [first_name, setFirst_name] = useState("John");
  const [last_name, setLast_name] = useState("Doe");

  const handleUploadSuccess = (imageUrl: string) => {
    setProfilePictureUrl(imageUrl);
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col">
        <div
          className="size-[128px] flex justify-center items-center bg-[#F3EDFE] rounded-full relative cursor-pointer"
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
            <RiUserLine size={68} className="text-[#6619DE]" />
          )}
          <div className="absolute size-[24px] bg-gradient-to-br from-[rgb(102,25,222)] to-[#1186DA] bottom-[2px] rounded-full right-[2px] flex justify-center items-center">
            <MdOutlinePhotoCamera className="text-white" size={14} />
          </div>
        </div>

        <form className="w-full flex gap-4 flex-col mt-9">
          <div className="flex gap-5 flex-col sm:flex-row">
            <div className="flex-1">
              <Label
                htmlFor="first_name"
                className="text-[#000000] font-semibold text-sm sm:text-base"
              >
                First name
              </Label>
              <Input
                type="text"
                id="first_name"
                className="mt-2 h-[55px] border border-[#6B728021] rounded-[10px]"
                value={first_name}
                onChange={(e) => setFirst_name(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label
                htmlFor="last_name"
                className="text-[#000000] font-semibold text-sm sm:text-base"
              >
                Last name
              </Label>
              <Input
                type="text"
                id="last_name"
                className="mt-2 h-[55px] border border-[#6B728021] rounded-[10px]"
                value={last_name}
                onChange={(e) => setLast_name(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-2">
            <Label
              htmlFor="team_name_and_role"
              className="text-[#000000] font-semibold text-sm sm:text-base"
            >
              Team Name/Role
            </Label>
            <div className="relative mt-2">
              <input
                type="text"
                id="team_name_and_role"
                className="flex h-[55px] w-full rounded-md border border-input bg-[#F3F4F6] pl-3 pr-10 py-2 text-base text-[#6B7280] font-semibold ring-offset-background disabled:cursor-not-allowed md:text-sm"
                disabled
                value="Marketing Department • Team Lead"
                readOnly
              />
              <GiPadlock
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                size={18}
              />
            </div>
          </div>
          <div className="mt-2">
            <Label
              htmlFor="timezone_work_hours"
              className="text-[#000000] font-semibold text-sm sm:text-base"
            >
              Timezone/Work Hours
            </Label>
            <div className="relative mt-2">
              <input
                type="text"
                id="timezone_work_hours"
                className="flex h-[55px] w-full rounded-md border border-input bg-[#F3F4F6] pl-3 pr-10 py-2 text-base text-[#6B7280] font-semibold ring-offset-background disabled:cursor-not-allowed md:text-sm"
                disabled
                value="(WAT) | 9:00 AM - 5:00 PM"
                readOnly
              />
              <GiPadlock
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                size={18}
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
};

export default QuickSetupComponent;
