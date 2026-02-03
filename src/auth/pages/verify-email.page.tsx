import AuthFormLayout from "@/shared/components/auth-form-layout";
import AuthLayout from "@/shared/components/auth.layout.component";
import VerifyEmailFormComponent from "@/auth/components/forms/verify-email.form.component";
import useUrlSearchParams from "@/shared/hooks/use-url-search-params";

function VerfiyEmail() {
  const { getParam } = useUrlSearchParams();
  const email = getParam("email") ?? "";
  const code = getParam("otp") ?? "";
  return (
    <AuthLayout>
      <AuthFormLayout
        title="E-Mail Verification"
        subTitle={`We have mailed ${email} a 6-digit code, please check your email & enter the code here to complete the verification.`}
        Form={<VerifyEmailFormComponent email={email} code={code} />}
        centralizeText
      />
    </AuthLayout>
  );
}

export default VerfiyEmail;
