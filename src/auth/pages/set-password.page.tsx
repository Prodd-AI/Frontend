import SetPasswordFormComponent from "@/auth/components/forms/set-password.form.component";
import AuthImmersiveFormLayout from "@/shared/components/auth-immersive-form-layout";
import AuthImmersiveLayout from "@/shared/components/auth-immersive.layout.component";

function SetPassword() {
  return (
    <AuthImmersiveLayout>
      <AuthImmersiveFormLayout
        title="Create Your Password"
        subTitle="Set a password for your account to continue onboarding."
        Form={<SetPasswordFormComponent />}
      />
    </AuthImmersiveLayout>
  );
}

export default SetPassword;
