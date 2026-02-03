import OnboardingWizardCardLayout from "@/onboarding/components/onboarding-wizard-layout";
import AuthLayout from "@/shared/components/auth.layout.component";
import { useNavigate } from "react-router-dom";
import SetupWizardFormComponent from "@/onboarding/components/setup-wizard-form-component";
import WelcomeComponent from "./components/welcome.component";
import { MdCheck } from "react-icons/md";
import { UserPenIcon, Lock } from "lucide-react";
import QuickSetupComponent from "./components/quick-setup.component";
import CompleteComponent from "./components/complete.component";
import { FaCheckDouble } from "react-icons/fa6";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reset_password_schema } from "@/lib/schemas";
import { ResetPasswordFormData } from "@/auth/typings/auth";
import SetupPasswordComponent from "@/onboarding/components/setup-password.component";
import { reset_password } from "@/config/services/auth.service";
import useAuthStore from "@/config/stores/auth.store";
import { quick_setup_schema, QuickSetupForm, QUICK_SETUP_FIELDS } from "@/onboarding/schemas/quick-setup.schema";
import { update_user } from "@/config/services/users.service";

function HrSetup() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const quick_setup_form = useForm<QuickSetupForm>({
    resolver: zodResolver(quick_setup_schema),
    defaultValues: {
      first_name: user?.user.first_name ?? "",
      last_name: user?.user.last_name ?? "",
      avatar_url: user?.user.avatar_url ?? "",
    },
  });

  const password_form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(reset_password_schema),
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
      id: "setup_password",
      label: "Set Password",
      Icon: Lock,
      Component: () => <SetupPasswordComponent form={password_form} />,
      formMetaData: {
        heading: "Set Your Password",
        subHeading: "Create a secure password for your account",
      },
      skip: false,
      cbFn: async () => {
        const isValid = await password_form.trigger();
        if (!isValid) {
          throw new Error("Please fill in all required fields correctly");
        }

        const formData = password_form.getValues();
        if (!token) {
          throw new Error("Authentication token is missing");
        }

        const transformedData = {
          ...formData,
          token,
        };

        await reset_password(transformedData);
      },
    },
    {
      id: "complete",
      label: "Complete",
      Icon: FaCheckDouble,
      Component: () => <CompleteComponent />,
      skip: false,
      cbFn: () => {
        toast.success("Onboarding complete!");
        navigate("/dash/team-member")
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
