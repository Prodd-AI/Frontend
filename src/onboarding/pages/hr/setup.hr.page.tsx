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
import TeamSetup, {
  TeamsSetupFormData,
} from "@/onboarding/forms/hr/team-setup.component";
import InviteMember, {
  InviteMembersSetupFormData,
} from "@/onboarding/forms/hr/invite-member.component";
import Complete from "@/onboarding/forms/hr/complete.component";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  company_info_schema,
  teams_setup_schema,
  invite_members_setup_schema,
} from "@/lib/schemas";
import { useMutation } from "@tanstack/react-query";
import { createOrganization } from "@/config/services/organizations.service";
import { createTeam, addTeamMembers } from "@/config/services/teams.service";
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
      size: 0,
      industry: "",
    },
  });

  const [teamSetupBanner, setTeamSetupBanner] = useState<{
    open: boolean;
    variant: "success" | "critical" | "warning" | "info";
    title: string;
    description: string;
  }>({ open: false, variant: "info", title: "", description: "" });
  // teamSetupBanner is used in the Component closure below

  const [inviteMembersBanner, setInviteMembersBanner] = useState<{
    open: boolean;
    variant: "success" | "critical" | "warning" | "info";
    title: string;
    description: string;
  }>({ open: false, variant: "info", title: "", description: "" });
  // inviteMembersBanner is used in the Component closure below

  const teamsSetupForm = useForm<TeamsSetupFormData>({
    resolver: zodResolver(teams_setup_schema),
    defaultValues: {
      teams: [{ name: "", size: "", description: "" }],
    },
  });

  const inviteMembersForm = useForm<InviteMembersSetupFormData>({
    resolver: zodResolver(invite_members_setup_schema),
    defaultValues: {
      members: [
        {
          first_name: "",
          last_name: "",
          email: "",
          user_role: "team_member",
          team_id: "",
        },
      ],
    },
  });

  const { mutate: createOrg } = useMutation<
    GeneralReturnInt<unknown>,
    GeneralErrorInt,
    { name: string; size: string; industry: string }
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

  const { mutate: createTeamMutation } = useMutation<
    GeneralReturnInt<unknown>,
    GeneralErrorInt,
    { name: string; description: string; size: string }
  >({
    mutationFn: (data) => createTeam(data),
    onError: (error: GeneralErrorInt) => {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error && "message" in error) {
        if (typeof error.message === "string") {
          errorMessage = error.message;
        }
      }
      setTeamSetupBanner({
        open: true,
        variant: "critical",
        title: "Error",
        description: errorMessage,
      });
      throw error; // Re-throw to prevent wizard from proceeding
    },
  });

  const { mutate: inviteMembersMutation } = useMutation<
    GeneralReturnInt<unknown>,
    GeneralErrorInt,
    { members: InviteMembersSetupFormData["members"] }
  >({
    mutationFn: (data) => addTeamMembers(data),
    onSuccess: (response) => {
      setInviteMembersBanner({
        open: true,
        variant: "success",
        title: "Success!",
        description:
          response.message || "Team members invited successfully.",
      });
    },
    onError: (error: GeneralErrorInt) => {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error && "message" in error) {
        if (typeof error.message === "string") {
          errorMessage = error.message;
        }
      }
      setInviteMembersBanner({
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
        // Convert size number to string for API
        const apiData: { name: string; size: string; industry: string } = {
          name: formData.name,
          size: String(formData.size),
          industry: formData.industry,
        };
        await new Promise<void>((resolve, reject) => {
          createOrg(apiData, {
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
      Component: () => (
        <TeamSetup
          form={teamsSetupForm}
          banner={teamSetupBanner}
          onDismissBanner={() =>
            setTeamSetupBanner({ ...teamSetupBanner, open: false })
          }
        />
      ),
      formMetaData: {
        heading: "Setup Team",
        subHeading: "Create teams to organize your workforce",
      },
      skip: true,
      cbFn: async () => {
        const isValid = await teamsSetupForm.trigger();
        if (!isValid) {
          throw new Error("Please fill in all required fields correctly.");
        }
        const formData = teamsSetupForm.getValues();
        
        // Create all teams sequentially
        for (const team of formData.teams) {
          await new Promise<void>((resolve, reject) => {
            createTeamMutation(team, {
              onSuccess: () => resolve(),
              onError: (error) => reject(error),
            });
          });
        }
        
        setTeamSetupBanner({
          open: true,
          variant: "success",
          title: "Success!",
          description: `${formData.teams.length} team(s) created successfully.`,
        });
      },
    },
    {
      id: "invite_members",
      label: "Invite Members",
      Icon: IoPersonAddOutline,
      Component: () => (
        <InviteMember
          form={inviteMembersForm}
          banner={inviteMembersBanner}
          onDismissBanner={() =>
            setInviteMembersBanner({ ...inviteMembersBanner, open: false })
          }
        />
      ),
      formMetaData: {
        heading: "Invite Team Members",
        subHeading: "Send invitations to your team",
      },
      skip: true,
      cbFn: async () => {
        const isValid = await inviteMembersForm.trigger();
        if (!isValid) {
          throw new Error("Please fill in all required fields correctly.");
        }
        const formData = inviteMembersForm.getValues();
        await new Promise<void>((resolve, reject) => {
          inviteMembersMutation(formData, {
            onSuccess: () => resolve(),
            onError: (error: GeneralErrorInt) => reject(error),
          });
        });
      },
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
