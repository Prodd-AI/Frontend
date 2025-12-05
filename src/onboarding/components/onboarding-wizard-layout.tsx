import AuthCard from "@/shared/components/cards/auth-card";

function OnboardingWizardCardLayout({
  heading,
  subHeading,
  skip,
  Wizard,
}: OnboardingWizardCardLayoutPropsInt) {
  return (
    <div className="flex justify-center sm:px-6 md:px-8">
      <AuthCard className="w-full sm:!min-w-[60rem] lg:!min-w-[60rem]  min-h-[54.5rem]">
        <div className="flex justify-between items-center">
          <div className=" flex flex-col">
            {
              heading && (<h1 className=" text-[1.393rem] font-[600] text-[#251F2D]">
                {heading}
              </h1>)
            }
            {
              subHeading && (<h3 className=" text-[#6F7277] text-[0.875rem] sm:text-[1.094rem]">
                {subHeading}
              </h3>)
            }
          </div>
          {skip && skip.Component}
        </div>
        {Wizard}
      </AuthCard>
    </div>
  );
}

export default OnboardingWizardCardLayout;
