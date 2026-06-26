interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}