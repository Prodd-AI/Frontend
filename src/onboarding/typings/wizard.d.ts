interface WizardStep {
  id: string;
  label: string;
  Icon: IconType;
  Component?: () => React.ReactNode;
  formMetaData?: {
    heading?: string;
    subHeading?: string;
  };
  skip?: boolean;
  cbFn?: () => void | Promise<void>;
}

interface WizardStepActive extends WizardStep {
  active: boolean;
}
interface OnboardingWizardCardLayoutPropsInt {
  heading?: string;
  subHeading?: string;
  Wizard: React.ReactElement;
  skip?: {
    Component?: React.ReactNode;
  };
}
interface OnboardingProgressTrackerPropsInt {
  steps: WizardStepActive[];
  gotoNextWizard: (id: string) => () => void;
  isMobile: boolean;
}

interface OnboardingWizardFormComponentPropsInt {
  data: WizardStep[];
  currentStepId: string;
  handleSkip?: () => void;
  isMobile: boolean;
  error : string | null
}

interface OnboardingWizardNavigationComponentPropsInt {
  handleNextStep: () => void;
  handlePrevStep: () => void;
  completedSteps: string[];
  currentStepId: string;
  activeSteps: WizardStepActive[];
  loading ?: boolean
}

interface SetupWizardFormComponentPropsInt {
  steps: WizardStep[];
}
