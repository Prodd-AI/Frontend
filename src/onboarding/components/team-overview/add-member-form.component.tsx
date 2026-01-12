import { FaArrowLeft, FaArrowRight, FaCheck, FaTimes } from "react-icons/fa";

const AddMemberForm = ({
  step,
  value,
  onChange,
  onNext,
  onPrev,
  onSubmit,
  onClose,
  isFirstStep,
  isLastStep,
  currentStep,
  totalSteps,
}: AddMemberFormProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="self-end text-[#9CA3AF] hover:text-[#6B7280] transition-colors mb-1 cursor-pointer"
      >
        <FaTimes className="text-[10px]" />
      </button>

      {/* Step indicator */}
      <div className="flex gap-1 mb-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= currentStep ? "bg-[#6619DE]" : "bg-[#E5E7EB]"
            }`}
          />
        ))}
      </div>

      {/* Form field */}
      <div className="flex-1">
        <label
          htmlFor={step.id}
          className="text-[9px] font-medium text-[#374151] block mb-1"
        >
          {step.label}
        </label>

        <input
          type={step.type}
          id={step.id}
          name={step.id}
          value={value}
          placeholder={step.placeholder}
          onChange={(e) => onChange(step.id, e.target.value)}
          className="w-full border border-[#D1D5DB] rounded-md text-[10px] px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#6619DE] focus:border-[#6619DE] transition-all"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-2 pt-1 border-t border-[#F3F4F6]">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirstStep}
          className={`p-1 rounded transition-colors ${
            isFirstStep
              ? "text-[#D1D5DB] cursor-not-allowed"
              : "text-[#6B7280] hover:text-[#6619DE] hover:bg-[#F3F4F6] cursor-pointer"
          }`}
        >
          <FaArrowLeft className="text-[10px]" />
        </button>

        {isLastStep ? (
          <button
            type="button"
            onClick={onSubmit}
            className="p-1 rounded text-white bg-[#6619DE] hover:bg-[#5215B3] transition-colors cursor-pointer"
          >
            <FaCheck className="text-[10px]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="p-1 rounded text-[#6B7280] hover:text-[#6619DE] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
          >
            <FaArrowRight className="text-[10px]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AddMemberForm;
