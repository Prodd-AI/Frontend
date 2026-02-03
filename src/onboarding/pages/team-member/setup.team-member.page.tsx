import OnboardingWizardCardLayout from "@/onboarding/components/onboarding-wizard-layout";
import AuthLayout from "@/shared/components/auth.layout.component";
import { useNavigate } from "react-router-dom";
import SetupWizardFormComponent from "@/onboarding/components/setup-wizard-form-component";
import WelcomeComponent from "./components/welcome.component";
import { MdCheck } from "react-icons/md";
import { UserPenIcon } from "lucide-react";
import QuickSetupComponent from "./components/quick-setup.component";
import CompleteComponent from "./components/complete.component";
import { FaCheckDouble } from "react-icons/fa6";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/config/stores/auth.store";
import { quick_setup_schema, QuickSetupForm, QUICK_SETUP_FIELDS } from "@/onboarding/schemas/quick-setup.schema";
import { update_user } from "@/config/services/users.service";

function HrSetup() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const quick_setup_form = useForm<QuickSetupForm>({
    resolver: zodResolver(quick_setup_schema),
    defaultValues: {
      first_name: user?.user.first_name ?? "",
      last_name: user?.user.last_name ?? "",
      avatar_url: user?.user.avatar_url ?? "",
    },
  });

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
      Component: () => <QuickSetupComponent form={quick_setup_form} />,
      formMetaData: {
        heading: "",
        subHeading: "",
      },
      skip: false,
      cbFn: async () => {
        const isValid = await quick_setup_form.trigger(QUICK_SETUP_FIELDS, {
          shouldFocus: true,
        });
        if (!isValid) {
          throw new Error("Please fill in all required fields");
        }

        const formData = quick_setup_form.getValues();
        await update_user({
          first_name: formData.first_name,
          last_name: formData.last_name,
          avatar_url: formData.avatar_url || "",
        });
      },
    },
    {
      id: "complete",
      label: "Complete",
      Icon: FaCheckDouble,
      Component: () => <CompleteComponent />,
      skip: false,
      cbFn: () => {
        toast.success("Onboarding complete. Click on forgot password to reset your password.");
        navigate("/auth/login")
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
