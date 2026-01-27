import { useState } from "react";
import {
  AddMemberButton,
  TeamMemberCard,
} from "@/onboarding/components/team-overview";
import { useMutation } from "@tanstack/react-query";
import { addTeamMembers } from "@/config/services/teams.service";
import Banner from "@/shared/components/banner.component";
import { FiSave } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import AddTeamMember from "@/onboarding/components/team-overview/add-member-form.component";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const add_team_member_schema = z.object({
  first_name: z
    .string()
    .min(2, "First Name is be at least 3 characters")
    .max(80, "First Name must not exceed 80 characters"),
  last_name: z
    .string()
    .min(2, "Last Name is be at least 3 characters")
    .max(80, "Last Name must not exceed 80 characters"),
  user_role: z.enum(["team_lead", "team_member"]),
  email: z.email("Please enter a valid email"),
});
export type AddTeamMemberFormData = z.infer<typeof add_team_member_schema>;

function TeamOverview() {
  const [openAddTeamMemberDialog, setOpenAddTeamMemberDialog] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMemberDetails[]>([]);

  const [banner, setBanner] = useState<{
    message: string;
    variant: "success" | "critical";
    isOpen: boolean;
  }>({
    message: "",
    variant: "success",
    isOpen: false,
  });

  const { mutate: submitTeamMembers, isPending } = useMutation({
    mutationFn: (members: TeamMemberDetails[]) => addTeamMembers(members),
    onSuccess: () => {
      setBanner({
        message: "Team members added successfully!",
        variant: "success",
        isOpen: true,
      });
      setTeamMembers([]);
    },
    onError: (error: Error) => {
      setBanner({
        message: error.message || "Failed to add team members",
        variant: "critical",
        isOpen: true,
      });
    },
  });
  const { register, getValues, reset, control } =
    useForm<AddTeamMemberFormData>({
      resolver: zodResolver(add_team_member_schema),
      defaultValues: {
        first_name: "",
        last_name: "",
        email: "",
        user_role: "team_member",
      },
    });

  const handleAddTeamMember = () => {
    const member = getValues();
    if (
      member.email === "" ||
      member.first_name === "" ||
      member.last_name === "" ||
      (member.user_role !== "team_member" && member.user_role !== "team_lead")
    )
      return;
    setTeamMembers((members) => [...members, member]);
    reset();
    setOpenAddTeamMemberDialog(false);
  };
  const handleSubmitTeamMembers = () => {
    if (teamMembers.length === 0) return;
    submitTeamMembers(teamMembers);
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers((members) => members.filter((_, i) => i !== index));
  };


  return (
    <div className="p-4">
      <Banner
        open={banner.isOpen}
        description={banner.message}
        onDismiss={() =>
          setBanner({ message: "", variant: "success", isOpen: false })
        }
        variant={banner.variant}
        isDismiss
        className="mb-4"
      />
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-base text-[#251F2D]">Team Members</h4>
        <span className="text-xs text-[#6B7280]">
          {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex gap-3 flex-wrap">
        {teamMembers.map((member, index) => (
          <TeamMemberCard
            key={`${member.email}-${index}`}
            {...member}
            onRemove={() => handleRemoveMember(index)}
          />
        ))}

        <div
          className={`w-[140px] min-h-[120px] border-2 border-dashed rounded-xl p-3 flex flex-col transition-all duration-300 `}
        >
          <AddMemberButton onClick={() => setOpenAddTeamMemberDialog(true)} />
        </div>
      </div>

      {teamMembers.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmitTeamMembers}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#6619DE] hover:bg-[#5214B8] disabled:bg-[#9B7DD4] text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <CgSpinner className="animate-spin" size={18} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave size={18} />
                <span>Save Members</span>
              </>
            )}
          </button>
        </div>
      )}

      <Dialog
        open={openAddTeamMemberDialog}
        onOpenChange={setOpenAddTeamMemberDialog}
      >
        <DialogContent>
          <DialogHeader className="text-lg font-semibold text-gray-900 mb-6">
            Add team member
          </DialogHeader>
          <AddTeamMember register={register} control={control} />
          <DialogFooter>
            {" "}
            <DialogClose>
              <Button
                variant="outline"
                className="px-6 h-10 border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleAddTeamMember}
              className="px-6 h-10 text-white"
            >
              Add member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TeamOverview;
