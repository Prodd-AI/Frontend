import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const STEP_QUERY_PARAM = "step";

const useOnboardWizard = (steps: WizardStep[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const stepFromUrl = searchParams.get(STEP_QUERY_PARAM);

  const isValidUrlStep =
    stepFromUrl && steps.some((step) => step.id === stepFromUrl);

  const [currentStepId, setCurrentStepId] = useState(
    isValidUrlStep ? stepFromUrl : steps[0]?.id || ""
  );
  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    if (isValidUrlStep) {
      const stepIndex = steps.findIndex((step) => step.id === stepFromUrl);
      if (stepIndex > 0) {
        return steps.slice(0, stepIndex).map((step) => step.id);
      }
    }
    return [];
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateStep = useCallback(
    (newStepId: string) => {
      setCurrentStepId(newStepId);
      const newParams = new URLSearchParams(searchParams);
      newParams.set(STEP_QUERY_PARAM, newStepId);
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

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
        updateStep(id);
      }
    },
    [steps, completedSteps, updateStep]
  );

  const handleNextStep = useCallback(async () => {
    setError(null);
    const currentIndex = steps.findIndex((step) => step.id === currentStepId);

    if (currentIndex === -1) return;

    const currentStep = steps[currentIndex];
    const isLastStep = currentIndex >= steps.length - 1;

    const proceedToNext = () => {
      setCompletedSteps((prev) =>
        prev.includes(currentStepId) ? prev : [...prev, currentStepId]
      );
      if (!isLastStep) {
        updateStep(steps[currentIndex + 1].id);
      }
    };

    if (currentStep.cbFn) {
      const result = currentStep.cbFn();

      if (result instanceof Promise) {
        try {
          setLoading(true);
          await result;
          proceedToNext();
        } catch (err: unknown) {
          if (typeof err === "string") {
            setError(err);
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred");
          }
          return;
        } finally {
          setLoading(false);
        }
      } else {
        proceedToNext();
      }
    } else {
      proceedToNext();
    }
  }, [steps, currentStepId, updateStep]);

  const handlePrevStep = useCallback(() => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId);
    if (currentIndex <= 0) return;

    updateStep(steps[currentIndex - 1].id);
  }, [steps, currentStepId, updateStep]);

  const handleSkip = useCallback(() => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId);
    if (currentIndex === -1 || currentIndex >= steps.length - 1) return;

    setCompletedSteps((prev) =>
      prev.includes(currentStepId) ? prev : [...prev, currentStepId]
    );
    updateStep(steps[currentIndex + 1].id);
  }, [steps, currentStepId, updateStep]);

  return {
    activeSteps,
    handleGotoWizard,
    handleNextStep,
    currentStepId,
    handlePrevStep,
    completedSteps,
    handleSkip,
    loading,
    error,
  };
};

export default useOnboardWizard;
