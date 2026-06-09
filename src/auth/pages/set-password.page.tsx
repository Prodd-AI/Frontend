import SetPasswordFormComponent from "@/auth/components/forms/set-password.form.component";
import AuthFormLayout from "@/shared/components/auth-form-layout";
import AuthLayout from "@/shared/components/auth.layout.component";

function SetPassword() {
  return (
    <AuthLayout>
      <AuthFormLayout
        title="Create Your Password"
        subTitle="Set a password for your account to continue onboarding."
        Form={<SetPasswordFormComponent />}
      />
    </AuthLayout>
  );
}

export default SetPassword;
