import { Button } from "@/components/ui/button";
import AuthImmersiveFormLayout from "@/shared/components/auth-immersive-form-layout";
import AuthImmersiveLayout from "@/shared/components/auth-immersive.layout.component";
import { Link } from "react-router-dom";
import CelebrationIcon from "@/components/ui/celebration-icon";

function PassWordResetSuccess() {
  return (
    <AuthImmersiveLayout>
      <AuthImmersiveFormLayout centralizeText Form={<ResetComponent />} />
    </AuthImmersiveLayout>
  );
}

export default PassWordResetSuccess;

const ResetComponent = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="auth-immersive-status-icon">
        <CelebrationIcon />
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="auth-immersive-status-title">Successful Password Reset</h1>
        <p className="auth-immersive-status-copy">
          You can now your password to login to login your account
        </p>
      </div>
      <Link to="/auth/login" className="w-full">
        <Button className="auth-immersive-btn w-full">Login</Button>
      </Link>
    </div>
  );
};