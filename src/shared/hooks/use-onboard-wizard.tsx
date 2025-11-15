import { useCallback, useMemo, useState } from "react";

const useOnboardWizard = (steps: WizardStep[]) => {
  const [currentStepId, setCurrentStepId] = useState(steps[0]?.id || "");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const activeSteps = useMemo(() => {
    return steps.map((step) => ({
      ...step,
      active: step.id === currentStepId || completedSteps.includes(step.id),
    }));
  }, [steps, currentStepId, completedSteps]);

  const handleGotoWizard = useCallback(
    (id: string) => () => {
      const targetStepIndex = steps.findIndex((step) => step.id === id);
      if (targetStepIndex === -1) return;

      const allPreviousStepsCompleted = steps
        .slice(0, targetStepIndex)
        .every((step) => completedSteps.includes(step.id));

      if (allPreviousStepsCompleted) {
        setCurrentStepId(id);
      }
    },
    [steps, completedSteps]
  );

  const handleNextStep = useCallback(() => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId);
    if (currentIndex === -1 || currentIndex >= steps.length - 1) return;

    setCompletedSteps((prev) =>
      prev.includes(currentStepId) ? prev : [...prev, currentStepId]
    );
    setCurrentStepId(steps[currentIndex + 1].id);
  }, [steps, currentStepId]);

  const handlePrevStep = useCallback(() => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId);
    if (currentIndex <= 0) return;

    setCurrentStepId(steps[currentIndex - 1].id);
  }, [steps, currentStepId]);

  const handleSkip = useCallback(() => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId);
    if (currentIndex === -1 || currentIndex >= steps.length - 1) return;

    setCompletedSteps((prev) =>
      prev.includes(currentStepId) ? prev : [...prev, currentStepId]
    );
    setCurrentStepId(steps[currentIndex + 1].id);
  }, [steps, currentStepId]);

  return {
    activeSteps,
    handleGotoWizard,
    handleNextStep,
    currentStepId,
    handlePrevStep,
    completedSteps,
    handleSkip,
  };
};

export default useOnboardWizard;
