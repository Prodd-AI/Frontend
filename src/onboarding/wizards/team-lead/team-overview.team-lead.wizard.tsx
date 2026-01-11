import { useState } from "react";
import {
  AddMemberButton,
  AddMemberForm,
  TeamMemberCard,
} from "@/onboarding/components/team-overview";
import { useMutation } from "@tanstack/react-query";
import { addTeamMembers } from "@/config/services/teams.service";
import Banner from "@/shared/components/banner.component";
import { FiSave } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

const steps: StepConfig[] = [
  {
    label: "First Name",
    id: "first_name",
    type: "text",
    placeholder: "e.g. John",
  },
  {
    label: "Last Name",
    id: "last_name",
    type: "text",
    placeholder: "e.g. Doe",
  },
  {
    label: "Email Address",
    id: "email",
    type: "email",
    placeholder: "e.g. john@example.com",
  },
];

const initialTeamMember: TeamMemberDetails = {
  email: "",
  first_name: "",
  last_name: "",
};

function TeamOverview() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberDetails[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [teamMember, setTeamMember] =
    useState<TeamMemberDetails>(initialTeamMember);
  const [isAddingMember, setIsAddingMember] = useState(false);
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

  const handleSubmitTeamMembers = () => {
    if (teamMembers.length === 0) return;
    submitTeamMembers(teamMembers);
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers((members) => members.filter((_, i) => i !== index));
  };

  const handleOpenForm = () => {
    setIsAddingMember(true);
    setCurrentStep(0);
    setTeamMember(initialTeamMember);
  };

  const handleCloseForm = () => {
    setIsAddingMember(false);
    setCurrentStep(0);
    setTeamMember(initialTeamMember);
  };

  const handleAddTeamMember = () => {
    if (!teamMember.first_name || !teamMember.last_name || !teamMember.email) {
      return;
    }
    setTeamMembers((members) => [...members, teamMember]);
    handleCloseForm();
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setTeamMember((prev) => ({ ...prev, [id]: value }));
  };

  const isLastStep = currentStep === steps.length - 1;
  const currentStepConfig = steps[currentStep];

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
          className={`w-[140px] min-h-[120px] border-2 border-dashed rounded-xl p-3 flex flex-col transition-all duration-300 ${
            isAddingMember
              ? "border-[#6619DE] bg-[#F9F5FF]"
              : "border-[#D1D5DB] hover:border-[#6619DE] hover:bg-[#F9F5FF]"
          }`}
        >
          {isAddingMember ? (
            <AddMemberForm
              step={currentStepConfig}
              value={teamMember[currentStepConfig.id] || ""}
              onChange={handleInputChange}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              onSubmit={handleAddTeamMember}
              onClose={handleCloseForm}
              isFirstStep={currentStep === 0}
              isLastStep={isLastStep}
              currentStep={currentStep}
              totalSteps={steps.length}
            />
          ) : (
            <AddMemberButton onClick={handleOpenForm} />
          )}
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
    </div>
  );
}

export default TeamOverview;
