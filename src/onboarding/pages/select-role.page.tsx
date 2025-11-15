import AuthFormLayout from "@/shared/components/auth-form-layout";
import AuthLayout from "@/shared/components/auth.layout.component";
import SelectRoleFormComponent from "../components/select-role.onboarding.component";

function SelectRole() {
  return (
    <AuthLayout >
      <AuthFormLayout
        title="Set Up Your Workspace Role"
        subTitle="Choose the role that best matches how you’ll use the platform."
        centralizeText
        Form={<SelectRoleFormComponent />}
      />
    </AuthLayout>
  );
}

export default SelectRole;
