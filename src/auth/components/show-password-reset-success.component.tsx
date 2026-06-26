import { Button } from "@/components/ui/button";
import AuthImmersiveFormLayout from "@/shared/components/auth-immersive-form-layout";
import { Link } from "react-router-dom";
import PasswordResetSuccessIcon from "@/components/ui/password-reset-success-icon";

function ShowPasswordResetSuccess() {
  return (
    <AuthImmersiveFormLayout
      centralizeText
      Form={
        <div className="flex flex-col items-center gap-4">
          <div className="auth-immersive-status-icon">
            <PasswordResetSuccessIcon />
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h2 className="auth-immersive-status-title">
              Successful Password Reset
            </h2>
            <p className="auth-immersive-status-copy">
              You can now your password to login to login your account
            </p>
          </div>
          <Link to="/" className="w-full">
            <Button className="auth-immersive-btn w-full">Login</Button>
          </Link>
        </div>
      }
    />
  );
}

export default ShowPasswordResetSuccess;