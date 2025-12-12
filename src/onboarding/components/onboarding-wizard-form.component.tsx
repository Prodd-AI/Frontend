import { Button } from "@/components/ui/button";
import Banner from "@/shared/components/banner.component";
import { Activity } from "react";

function OnboardingWizardFormComponent({
  data,
  currentStepId,
  handleSkip,
  isMobile,
  error,
}: OnboardingWizardFormComponentPropsInt) {
  return (
    <div className="mt-8">
      {error && <Banner open={true} variant="critical" description={error} />}
      <div className="mt-4">
        {data.map((step) => {
          const isCurrentStep = currentStepId === step.id;

          return (
            <Activity key={step.id} mode={isCurrentStep ? "visible" : "hidden"}>
              {isCurrentStep && step.formMetaData && (
                <div className="w-full flex justify-between items-center mb-4">
                  <div className="flex flex-col gap-[1px]">
                    <h3 className="font-[700] text-[16px] text-[#251F2D]">
                      {step.formMetaData.heading}
                    </h3>
                    <h5 className="text-[#6B7280] text-[14px] font-[400]">
                      {step.formMetaData.subHeading}
                    </h5>
                  </div>
                  {step.skip &&
                    handleSkip &&
                    (isMobile ? (
                      <button
                        className="text-[#6619DE] font-[600]"
                        onClick={handleSkip}
                      >
                        Skip
                      </button>
                    ) : (
                      <Button
                        variant="outline"
                        className="bg-[#EFE5FE] text-[#6619DE] h-[44px] w-[88px] rounded-[100px]"
                        onClick={handleSkip}
                      >
                        Skip
                      </Button>
                    ))}
                </div>
              )}
              {step.Component?.()}
            </Activity>
          );
        })}
      </div>
    </div>
  );
}

export default OnboardingWizardFormComponent;
