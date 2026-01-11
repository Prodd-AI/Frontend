interface TeamMemberDetails {
  first_name: string;
  last_name: string;
  email: string;
}

interface StepConfig {
  label: string;
  id: keyof TeamMemberDetails;
  type: string;
  placeholder: string;
}

interface AddMemberButtonProps {
  onClick: () => void;
}

interface AddMemberFormProps {
  step: StepConfig;
  value: string;
  onChange: (id: string, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  onClose: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStep: number;
  totalSteps: number;
}
