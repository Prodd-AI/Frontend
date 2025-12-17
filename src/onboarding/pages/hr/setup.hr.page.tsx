// import OnboardingWizardCardLayout from "@/onboarding/components/onboarding-wizard-layout";
// import SetupWizardFormComponent from "@/onboarding/components/setup-wizard-form-component";
import AuthLayout from "@/shared/components/auth.layout.component";
// import { GoCheckCircle } from "react-icons/go";
// import { IoPeopleOutline, IoPersonAddOutline } from "react-icons/io5";
// import { MdOutlineHomeWork } from "react-icons/md";
// import { useNavigate } from "react-router-dom";

function HrSetup() {
  // const navigate = useNavigate();

  // const steps: WizardStep[] = [
  //   {
  //     id: "company_info",
  //     label: "Company Info",
  //     Icon: MdOutlineHomeWork,
  //     Component: () => <>CompanyInfo</>,
  //     formMetaData: {
  //       heading: "Company Information",
  //       subHeading: "Add your company details",
  //     },
  //     skip: true,
  //   },
  //   {
  //     id: "team_setup",
  //     label: "Team Setup",
  //     Icon: IoPeopleOutline,
  //     Component: () => <>TeamSetup</>,
  //     formMetaData: {
  //       heading: "Setup Team",
  //       subHeading: "Create teams to organize your workforce",
  //     },
  //     skip: false,
  //   },
  //   {
  //     id: "invite_members",
  //     label: "Invite Members",
  //     Icon: IoPersonAddOutline,
  //     Component: () => <>Invite Member</>,
  //     formMetaData: {
  //       heading: "Invite Team Members",
  //       subHeading: "Send invitations to your team",
  //     },
  //     skip: true,
  //   },
  //   {
  //     id: "complete",
  //     label: "Complete",
  //     Icon: GoCheckCircle,
  //     Component: () => <>Complete</>,
  //     skip: false,
  //     cbFn: () => {
  //       navigate("/");
  //     },
  //   },
  // ];
  return (
    <AuthLayout>
      <></>
      {/* <OnboardingWizardCardLayout
        heading="Set Up Your Organization"
        subHeading="Add your company details, invite team leads, and create teams to get started."
        Wizard={<SetupWizardFormComponent steps={steps} />}
      /> */}
    </AuthLayout>
  );
}

export default HrSetup;
