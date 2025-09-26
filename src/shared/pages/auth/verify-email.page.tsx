import AuthFormLayout from "@/shared/components/auth-form-layout";
import AuthLayout from "@/shared/components/auth.layout.component";
import VerifyEmailFormComponent from "@/shared/components/forms/verify-email.form.component";

function VerfiyEmail() {
  return (
    <AuthLayout>
      <AuthFormLayout
        title="E-Mail Verification"
        subTitle="We have mailed you a 6-digit code, please check your email & enter the code here to complete the verification."
        Form={VerifyEmailFormComponent}
        centralizeText
      />
    </AuthLayout>
  );
}

export default VerfiyEmail;
