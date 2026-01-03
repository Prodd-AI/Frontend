import OnboardingWizardCardLayout from "@/onboarding/components/onboarding-wizard-layout";
import AuthLayout from "@/shared/components/auth.layout.component";
import { useNavigate } from "react-router-dom";
import SetupWizardFormComponent from "@/onboarding/components/setup-wizard-form-component";
import WelcomeComponent from "./components/welcome.component";
import { MdCheck } from "react-icons/md";
import { UserPenIcon, Users } from "lucide-react";
import QuickSetupComponent from "./components/quick-setup.component";
import TeamOverviewComponent from "./components/team-overview.component";
import CompleteComponent from "./components/complete.component";
import { FaCheckDouble } from "react-icons/fa6";

function HrSetup() {
  const navigate = useNavigate();

  const steps: WizardStep[] = [
    {
      id: "welcome",
      label: "Welcome",
      Icon: MdCheck,
      Component: () => <WelcomeComponent />,
      formMetaData: {
        heading: "",
        subHeading: "",
      },
      skip: false,
    },
    {
      id: "quick_setup",
      label: "Quick Setup",
      Icon: UserPenIcon,
      Component: () => <QuickSetupComponent />,
      formMetaData: {
        heading: "",
        subHeading: "",
      },
      skip: false,
    },
    {
      id: "team_overview",
      label: "Team Overview",
      Icon: Users,
      Component: () => <TeamOverviewComponent />,
      formMetaData: {
        heading: "Your Team",
        subHeading: "",
      },
      skip: false,
    },
    {
      id: "complete",
      label: "Complete",
      Icon: FaCheckDouble,
      Component: () => <CompleteComponent />,
      skip: false,
      cbFn: () => {
        navigate("/dash/team-member");
      },
    },
  ];
  return (
    <AuthLayout>
      <></>
      <OnboardingWizardCardLayout
        heading="Set Up Your Organization"
        subHeading="Add your company details, invite team leads, and create teams to get started."
        Wizard={<SetupWizardFormComponent steps={steps} />}
      />
    </AuthLayout>
  );
}

export default HrSetup;
