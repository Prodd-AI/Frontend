import AuthFormLayout from "@/shared/components/auth-form-layout";
import AuthLayout from "@/shared/components/auth.layout.component";
import ForgotPasswordFormComponent from "@/shared/components/forms/forgot-password.form.component";

function ForgotPassword() {
  return (
    <AuthLayout
      children={
        <AuthFormLayout
          title="Reset Your Password"
          subTitle="Enter your email to receive a link and create a new password."
          Form={ForgotPasswordFormComponent}
        />
      }
    />
  );
}

export default ForgotPassword;
