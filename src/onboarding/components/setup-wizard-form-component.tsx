import useOnboardWizard from "@/shared/hooks/useOnboardWizard";
import OnboardingProgressTracker from "./onboarding-progress-tracker.component";
import OnboardingWizardFormComponent from "./onboarding-wizard-form.component";
import OnboardingWizardNavigationComponent from "./onboarding-wizard-navigation";
import useIsMobile from "@/shared/hooks/useIsMobile";

function SetupWizardFormComponent({ steps }: SetupWizardFormComponentPropsInt) {
  const {
    activeSteps,
    handleGotoWizard,
    handleNextStep,
    currentStepId,
    handlePrevStep,
    completedSteps,
    handleSkip,
  } = useOnboardWizard(steps);
  const isMobile = useIsMobile();
  return (
    <div className="space-y-6">
      <OnboardingProgressTracker
        steps={activeSteps}
        gotoNextWizard={handleGotoWizard}
        isMobile={isMobile}
      />

      <OnboardingWizardFormComponent
        data={steps}
        currentStepId={currentStepId}
        handleSkip={handleSkip}
        isMobile={isMobile}
      />

      <OnboardingWizardNavigationComponent
        handleNextStep={handleNextStep}
        handlePrevStep={handlePrevStep}
        completedSteps={completedSteps}
        currentStepId={currentStepId}
        activeSteps={activeSteps}
      />
    </div>
  );
}

export default SetupWizardFormComponent;
