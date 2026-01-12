import AuthFormLayout from "@/shared/components/auth-form-layout";
import AuthLayout from "@/shared/components/auth.layout.component";
import LoginFormComponent from "@/auth/components/forms/login.form.component";

function Login() {
  return (
    <AuthLayout className="bg-black">
      <AuthFormLayout
      
        title="Welcome Back"
        subTitle="Log in to continue where you left off and stay connected with your team."
        Form={<LoginFormComponent />}
      />
    </AuthLayout>
  );
}

export default Login;
