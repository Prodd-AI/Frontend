import OnboardingWizardCardLayout from "@/onboarding/components/onboarding-wizard-layout";
import SetupWizardFormComponent from "@/onboarding/components/setup-wizard-form-component";
import AuthLayout from "@/shared/components/auth.layout.component";
import { GoCheckCircle } from "react-icons/go";
import { IoPeopleOutline, IoPersonAddOutline } from "react-icons/io5";
import { MdOutlineHomeWork } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import CompanyInfo, {
  CompanyInfoFormData,
} from "@/onboarding/forms/hr/company-info.component";
import TeamSetup from "@/onboarding/forms/hr/team-setup.component";
import InviteMember from "@/onboarding/forms/hr/invite-member.component";
import Complete from "@/onboarding/forms/hr/complete.component";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { company_info_schema } from "@/lib/schemas";
import { useMutation } from "@tanstack/react-query";
import { createOrganization } from "@/config/services/organizations.service";
import { useState } from "react";

function HrSetup() {
  const navigate = useNavigate();
  const [companyInfoBanner, setCompanyInfoBanner] = useState<{
    open: boolean;
    variant: "success" | "critical" | "warning" | "info";
    title: string;
    description: string;
  }>({ open: false, variant: "info", title: "", description: "" });

  const companyInfoForm = useForm<CompanyInfoFormData>({
    resolver: zodResolver(company_info_schema),
    defaultValues: {
      name: "",
      size: "",
      industry: "",
    },
  });

  const { mutate: createOrg } = useMutation<
    GeneralReturnInt<unknown>,
    GeneralErrorInt,
    CompanyInfoFormData
  >({
    mutationFn: (data) => createOrganization(data),
    onSuccess: (response) => {
      setCompanyInfoBanner({
        open: true,
        variant: "success",
        title: "Success!",
        description:
          response.message || "Company information saved successfully.",
      });
    },
    onError: (error: GeneralErrorInt) => {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error && "message" in error) {
        if (typeof error.message === "string") {
          errorMessage = error.message;
        }
      }
      setCompanyInfoBanner({
        open: true,
        variant: "critical",
        title: "Error",
        description: errorMessage,
      });
      throw error; // Re-throw to prevent wizard from proceeding
    },
  });

  const steps: WizardStep[] = [
    {
      id: "company_info",
      label: "Company Info",
      Icon: MdOutlineHomeWork,
      Component: () => (
        <CompanyInfo
          form={companyInfoForm}
          banner={companyInfoBanner}
          onDismissBanner={() =>
            setCompanyInfoBanner({ ...companyInfoBanner, open: false })
          }
        />
      ),
      formMetaData: {
        heading: "Company Information",
        subHeading: "",
      },
      skip: false,
      cbFn: async () => {
        const isValid = await companyInfoForm.trigger();
        if (!isValid) {
          throw new Error("Please fill in all required fields correctly.");
        }
        const formData = companyInfoForm.getValues();
        await new Promise<void>((resolve, reject) => {
          createOrg(formData, {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          });
        });
      },
    },
    {
      id: "team_setup",
      label: "Team Setup",
      Icon: IoPeopleOutline,
      Component: () => <TeamSetup />,
      formMetaData: {
        heading: "Setup Team",
        subHeading: "Create teams to organize your workforce",
      },
      skip: true,
    },
    {
      id: "invite_members",
      label: "Invite Members",
      Icon: IoPersonAddOutline,
      Component: () => <InviteMember />,
      formMetaData: {
        heading: "Invite Team Members",
        subHeading: "Send invitations to your team",
      },
      skip: true,
    },
    {
      id: "complete",
      label: "Complete",
      Icon: GoCheckCircle,
      Component: () => <Complete />,
      skip: false,
      cbFn: () => {
        navigate("/dash/hr");
      },
    },
  ];
  return (
    <AuthLayout>
      <OnboardingWizardCardLayout
        heading="Set Up Your Organization"
        subHeading="Add your company details, invite team leads, and create teams to get started."
        Wizard={<SetupWizardFormComponent steps={steps} />}
      />
    </AuthLayout>
  );
}

export default HrSetup;
