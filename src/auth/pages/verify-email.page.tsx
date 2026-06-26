import AuthImmersiveFormLayout from "@/shared/components/auth-immersive-form-layout";
import AuthImmersiveLayout from "@/shared/components/auth-immersive.layout.component";
import VerifyEmailFormComponent from "@/auth/components/forms/verify-email.form.component";
import useUrlSearchParams from "@/shared/hooks/use-url-search-params";

function VerfiyEmail() {
  const { getParam } = useUrlSearchParams();
  const email = getParam("email") ?? "";
  const code = getParam("otp") ?? "";
  return (
    <AuthImmersiveLayout>
      <AuthImmersiveFormLayout
        title="E-Mail Verification"
        subTitle={`We have mailed ${email} a 6-digit code, please check your email & enter the code here to complete the verification.`}
        Form={<VerifyEmailFormComponent email={email} code={code} />}
        centralizeText
      />
    </AuthImmersiveLayout>
  );
}

export default VerfiyEmail;
