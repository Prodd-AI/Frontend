interface WizardStep {
  id: string;
  label: string;
  Icon: IconType;
  Component?: React.ReactNode;
  formMetaData?: {
    heading?: string;
    subHeading?: string;
  };
  skip?: boolean;
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
}

interface OnboardingWizardNavigationComponentPropsInt {
  handleNextStep: () => void;
  handlePrevStep: () => void;
  completedSteps: string[];
  currentStepId: string;
  activeSteps: WizardStepActive[];
}

interface SetupWizardFormComponentPropsInt {
  steps: WizardStep[];
}
