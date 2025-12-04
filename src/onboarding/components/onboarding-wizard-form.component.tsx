import { Button } from "@/components/ui/button";
import { useMemo } from "react";

function OnboardingWizardFormComponent({
  data,
  currentStepId,
  handleSkip,
  isMobile,
}: OnboardingWizardFormComponentPropsInt) {
  const currentStep = useMemo(
    () => data.find((step) => step.id === currentStepId),
    [data, currentStepId]
  );

  if (!currentStep?.Component) return null;

  return (
    <div className="mt-8">
      <div>
        {currentStep.formMetaData && (
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col gap-[1px]">
              <h3 className="font-[700] text-[16px] text-[#251F2D]">
                {currentStep.formMetaData.heading}
              </h3>
              <h5 className="text-[#6B7280] text-[14px] font-[400]">
                {currentStep.formMetaData.subHeading}
              </h5>
            </div>
            {currentStep.skip &&
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
        <div>{currentStep.Component}</div>
      </div>
    </div>
  );
}

export default OnboardingWizardFormComponent;
