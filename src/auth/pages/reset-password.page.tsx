import AuthFormLayout from "@/shared/components/auth-form-layout";
import AuthLayout from "@/shared/components/auth.layout.component";
import ResetPasswordFormComponent from "@/auth/components/forms/reset-passord.form.component";
import { useState } from "react";
import ShowPasswordResetSuccess from "../components/show-password-reset-success.component";

function ResetPassword() {
  const [showPasswordResetSuccess, setShowPasswordResetSuccess] =
    useState(false);
  return (
    <AuthLayout>
      {showPasswordResetSuccess ? (
        <ShowPasswordResetSuccess />
      ) : (
        <AuthFormLayout
          title="Set a Fresh Password"
          subTitle="Enter a strong password and confirm it to regain access to your account."
          Form={
            <ResetPasswordFormComponent
              setShowPasswordResetSuccess={setShowPasswordResetSuccess}
            />
          }
        />
      )}
    </AuthLayout>
  );
}

export default ResetPassword;
