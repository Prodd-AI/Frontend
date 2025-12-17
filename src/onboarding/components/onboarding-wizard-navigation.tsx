import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { useMemo } from "react";

function OnboardingWizardNavigationComponent({
  handleNextStep,
  handlePrevStep,
  completedSteps,
  activeSteps,
  currentStepId,
  loading,
}: OnboardingWizardNavigationComponentPropsInt) {
  const isFirstStep = useMemo(
    () => activeSteps[0]?.id === currentStepId,
    [activeSteps, currentStepId]
  );

  // const isLastStep = useMemo(
  //   () => activeSteps[activeSteps.length - 1]?.id === currentStepId,
  //   [activeSteps, currentStepId]
  // );

  const canGoBack = useMemo(
    () => !isFirstStep && completedSteps.length > 0,
    [isFirstStep, completedSteps.length]
  );

  return (
    <div className="w-full flex justify-between items-center gap-4 px-6 py-4">
      <Button
        variant={canGoBack ? "default" : "ghost"}
        onClick={handlePrevStep}
        disabled={!canGoBack}
        className="min-w-[120px] h-11 font-medium transition-all"
      >
        Previous
      </Button>
      <LoadingButton
        onClick={handleNextStep}
        loading={loading}
        loadingText="Saving..."
        className="min-w-[160px] h-11 font-medium transition-all"
      >
        Save & Continue
      </LoadingButton>
    </div>
  );
}

export default OnboardingWizardNavigationComponent;
