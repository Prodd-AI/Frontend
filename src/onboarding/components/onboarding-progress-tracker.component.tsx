import { useMemo } from "react";

function OnboardingProgressTracker({
  steps = [],
  gotoNextWizard,
  isMobile,
}: OnboardingProgressTrackerPropsInt) {
  const progressPercentage = useMemo(() => {
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter((step) => step.active).length;
    return (completedSteps / steps.length) * 100;
  }, [steps]);

  if (isMobile) {
    return (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          {steps.map(({ label, id, active }, index) => (
            <div
              className="flex items-center gap-1"
              key={id}
              onClick={gotoNextWizard(id)}
            >
              <span
                className={`text-[12px] tracking-[-2%] whitespace-nowrap ${
                  active ? "text-[#6619DE] font-semibold" : "text-[#6B7280]"
                }`}
              >
                {label}
              </span>
              {index < steps.length - 1 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="2"
                  viewBox="0 0 16 2"
                  fill="none"
                  className="mx-1 flex-shrink-0"
                >
                  <line
                    x1="0"
                    y1="1"
                    x2="16"
                    y2="1"
                    stroke={active ? "#6619DE" : "#6B7280"}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeDasharray="2 2"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
        <div className="relative w-full flex items-center gap-3">
          <div className="flex-1 bg-[#F3F4F6] h-[16px] rounded-[100px] overflow-hidden">
            <div
              className="bg-[#6619DE] h-full rounded-[100px] transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-[14px] font-semibold text-[#6F7277] min-w-[40px]">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-[2.875rem] flex items-center justify-between">
      {steps.map(({ Icon, label, active, id }, index) => (
        <div key={id} className="flex items-center gap-[11px]">
          <div className="flex items-center gap-[11px]">
            <div
              className={`size-[46px] rounded-full flex justify-center items-center cursor-pointer transition-all ease-out ${
                active ? "bg-[#6619DE]" : "bg-[#F1EDF6]"
              }`}
              onClick={gotoNextWizard(id)}
            >
              <Icon
                size={28}
                className={active ? "text-white" : "text-[#6619DE]"}
              />
            </div>
            <h5
              className={`text-[0.974rem] leading-[15px] font-semibold whitespace-nowrap ${
                active ? "text-[#6619DE]" : "text-[#6B7280]"
              }`}
            >
              {label}
            </h5>
          </div>

          {index < steps.length - 1 && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="2"
              viewBox="0 0 56 2"
              fill="none"
              className="mx-2"
            >
              <line
                y1="1"
                x2="56"
                y2="1"
                stroke={active ? "#6619DE" : "#6B7280"}
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

export default OnboardingProgressTracker;
