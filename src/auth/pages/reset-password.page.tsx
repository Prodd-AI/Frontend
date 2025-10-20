import AuthFormLayout from "@/shared/components/auth-form-layout";
import AuthLayout from "@/shared/components/auth.layout.component";
import ResetPasswordFormComponent from "@/auth/components/forms/reset-passord.form.component";

function ResetPassword() {
  return (
    <AuthLayout>
      <AuthFormLayout
        title="Set a Fresh Password"
        subTitle="Enter a strong password and confirm it to regain access to your account."
        Form={ResetPasswordFormComponent}
      />
    </AuthLayout>
  );
}

export default ResetPassword;
