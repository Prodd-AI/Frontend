import LoginFormComponent from "@/auth/components/forms/login.form.component";
import AuthImmersiveFormLayout from "@/shared/components/auth-immersive-form-layout";
import AuthImmersiveLayout from "@/shared/components/auth-immersive.layout.component";
import { Link } from "react-router-dom";

function Login() {
  return (
    <AuthImmersiveLayout>
      <AuthImmersiveFormLayout
        title="Welcome Back"
        subTitle="Log in to continue where you left off and stay connected with your team."
        Form={<LoginFormComponent />}
        footer={
          <p className="auth-immersive-footer">
            <Link to="/privacy-policy" className="text-[#6619DE] hover:underline">
              Privacy Policy
            </Link>
          </p>
        }
      />
    </AuthImmersiveLayout>
  );
}

export default Login;
