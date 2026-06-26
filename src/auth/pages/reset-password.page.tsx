import AuthImmersiveFormLayout from "@/shared/components/auth-immersive-form-layout";
import AuthImmersiveLayout from "@/shared/components/auth-immersive.layout.component";
import ResetPasswordFormComponent from "@/auth/components/forms/reset-passord.form.component";
import { useState } from "react";
import ShowPasswordResetSuccess from "../components/show-password-reset-success.component";

function ResetPassword() {
  const [showPasswordResetSuccess, setShowPasswordResetSuccess] =
    useState(false);
  return (
    <AuthImmersiveLayout>
      {showPasswordResetSuccess ? (
        <ShowPasswordResetSuccess />
      ) : (
        <AuthImmersiveFormLayout
          title="Set a Fresh Password"
          subTitle="Enter a strong password and confirm it to regain access to your account."
          Form={
            <ResetPasswordFormComponent
              setShowPasswordResetSuccess={setShowPasswordResetSuccess}
            />
          }
        />
      )}
    </AuthImmersiveLayout>
  );
}

export default ResetPassword;
