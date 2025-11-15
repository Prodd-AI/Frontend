import { Button } from "@/components/ui/button";
import { useMemo } from "react";

function OnboardingWizardNavigationComponent({
  handleNextStep,
  handlePrevStep,
  completedSteps,
  activeSteps,
  currentStepId,
}: OnboardingWizardNavigationComponentPropsInt) {
  const isFirstStep = useMemo(
    () => activeSteps[0]?.id === currentStepId,
    [activeSteps, currentStepId]
  );

  const isLastStep = useMemo(
    () => activeSteps[activeSteps.length - 1]?.id === currentStepId,
    [activeSteps, currentStepId]
  );

  const canGoBack = useMemo(
    () => !isFirstStep && completedSteps.length > 0,
    [isFirstStep, completedSteps.length]
  );

  return (
    <div className="w-full flex justify-between items-center px-4">
      <Button
        variant={canGoBack ? "default" : "ghost"}
        onClick={handlePrevStep}
        disabled={!canGoBack}
      >
        Previous
      </Button>
      <Button
        variant={isLastStep ? "ghost" : "default"}
        onClick={handleNextStep}
        disabled={isLastStep}
      >
        Next
      </Button>
    </div>
  );
}

export default OnboardingWizardNavigationComponent;
