import RegisterFormComponent from "@/auth/components/forms/register.form.component";
import AuthImmersiveFormLayout from "@/shared/components/auth-immersive-form-layout";
import AuthImmersiveLayout from "@/shared/components/auth-immersive.layout.component";
import { Link } from "react-router-dom";

function Register() {
  return (
    <AuthImmersiveLayout>
      <AuthImmersiveFormLayout
        title="Get Started in Minutes"
        subTitle="Create your account to join your team and track progress seamlessly"
        Form={<RegisterFormComponent />}
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

export default Register;
