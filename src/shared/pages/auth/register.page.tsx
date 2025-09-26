import AuthLayout from "@/shared/components/auth.layout.component";

import RegisterFormComponent from "@/shared/components/forms/register.form.component";
import AuthFormLayout from "@/shared/components/auth-form-layout";

function Register() {
  return (
    <AuthLayout>
      <AuthFormLayout
        title="Get Started in Minutes"
        subTitle="Create your account to join your team and track progress seamlessly"
        Form={RegisterFormComponent}
      />
    </AuthLayout>
  );
}

export default Register;
