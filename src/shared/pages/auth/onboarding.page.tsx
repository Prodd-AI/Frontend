import AuthLayout from "@/shared/components/auth.layout.component";
import Logo from "@/shared/components/Logo.component";

function OnboardingPage() {
  return <AuthLayout children={<OnboardingComponent />} />;
}

export default OnboardingPage;

const OnboardingComponent = () => {
  return <div>
    <Logo />
  </div>;
};
