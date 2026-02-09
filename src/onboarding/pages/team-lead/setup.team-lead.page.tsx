import OnboardingWizardCardLayout from "@/onboarding/components/onboarding-wizard-layout";
import AuthLayout from "@/shared/components/auth.layout.component";
import { GoCheckCircle } from "react-icons/go";
import SetupWizardFormComponent from "@/onboarding/components/setup-wizard-form-component";
import WelcomeTeamLeadOnBoard from "@/onboarding/wizards/team-lead/welcome.onboard.component";
import { LiaUserEditSolid } from "react-icons/lia";
import SetupProfile from "@/onboarding/wizards/team-lead/setup-profile.component";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  team_lead_onboarding_schema,
  TeamLeadOnboardingForm,
  SETUP_PROFILE_FIELDS,
} from "@/onboarding/schemas/team-lead.schema";
import { useNavigate } from "react-router-dom";
import { update_user } from "@/config/services/users.service";
import { IoCheckmarkDone } from "react-icons/io5";
import CompleteTeamLeadOnBoard from "@/onboarding/wizards/team-lead/complete.onboard.component";
import useAuthStore from "@/config/stores/auth.store";
import { toast } from "sonner";
// import TeamOverview from "@/onboarding/wizards/team-lead/team-overview.team-lead.wizard";

function TeamLeadSetup() {
  const user = useAuthStore((state) => state.user);

  const setup_profile_form = useForm<TeamLeadOnboardingForm>({
    resolver: zodResolver(team_lead_onboarding_schema),
    defaultValues: {
      first_name: user?.user.first_name ?? "",
      last_name: user?.user.last_name ?? "",
      avatar_url: user?.user.avatar_url ?? "",
      timezone:
        user?.user.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      start_work_hour: user?.user.start_work_hour ?? "9:00 AM",
      end_work_hour: user?.user.end_work_hour ?? "5:00 PM",
    },
  });

  const navigate = useNavigate();

  const steps: WizardStep[] = [
    {
      id: "welcome_onboard",
      label: "Welcome",
      Icon: GoCheckCircle,
      Component: () => <WelcomeTeamLeadOnBoard />,
    },
    {
      id: "setup_profile",
      label: "Setup Profile",
      Icon: LiaUserEditSolid,
      Component: () => <SetupProfile form={setup_profile_form} />,
      cbFn: async () => {
        const isValid = await setup_profile_form.trigger(SETUP_PROFILE_FIELDS, {
          shouldFocus: true,
        });
        if (!isValid) {
          throw new Error("Please fill in all required fields");
        }

        const formData = setup_profile_form.getValues();
        const { timezone, start_work_hour, end_work_hour, ...restFormData } =
          formData;
        const transformedFormData = {
          ...restFormData,
          working_hours: {
            start_time: start_work_hour,
            end_time: end_work_hour,
            timezone: timezone,
          },
        };
        await update_user(transformedFormData);
      },
    },
    // {
    //   id: "team_overview",
    //   label: "Team Overview",
    //   Icon: IoPeople,
    //   Component: () => <TeamOverview />,
    // },
    {
      id: "complete_onboard",
      label: "Complete",
      Icon: IoCheckmarkDone,
      Component: () => <CompleteTeamLeadOnBoard />,
      cbFn: () => {
        toast.success("Onboarding complete. Click on forgot password to reset your password.");
        navigate("/auth/login");
      },
    },
  ];

  return (
    <AuthLayout>
      <OnboardingWizardCardLayout
        Wizard={<SetupWizardFormComponent steps={steps} />}
      />
    </AuthLayout>
  );
}

export default TeamLeadSetup;
