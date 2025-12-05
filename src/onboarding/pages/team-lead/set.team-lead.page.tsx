import OnboardingWizardCardLayout from "@/onboarding/components/onboarding-wizard-layout"
import AuthLayout from "@/shared/components/auth.layout.component"
import { GoCheckCircle } from "react-icons/go";
import SetupWizardFormComponent from "@/onboarding/components/setup-wizard-form-component";
import WelcomeTeamLeadOnBoard from "@/onboarding/components/team-lead/welcome.onboard.component";
import { LiaUserEditSolid } from "react-icons/lia";
import SetupProfile from "@/onboarding/components/team-lead/setup-profile.component";
const steps: WizardStep[] = [
    {
        id: "welcome_onboard",
        label: "Welcome",
        Icon: GoCheckCircle,
        Component: <WelcomeTeamLeadOnBoard />
    },
    {
        id: "setup_profile",
        label: "Setup Profile",
        Icon: LiaUserEditSolid,
        Component:<SetupProfile />
    },

];
function TeamLeadSetup() {
    return (
        <AuthLayout>
            <OnboardingWizardCardLayout
                Wizard={<SetupWizardFormComponent steps={steps} />}
            />
        </AuthLayout>
    )
}

export default TeamLeadSetup


