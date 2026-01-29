import { Button } from "@/components/ui/button";
import Banner from "@/shared/components/banner.component";
import { Activity } from "react";
import { AnimatePresence, motion } from "framer-motion";

const slideVariants = {
  initial: {
    x: 100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      duration: 0.4,
    },
  },
  exit: {
    x: -100,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

function OnboardingWizardFormComponent({
  data,
  currentStepId,
  handleSkip,
  isMobile,
  error,
}: OnboardingWizardFormComponentPropsInt) {
  return (
    <div className="mt-8">
      {error && (
        <Banner
          open={true}
          variant="critical"
          description={error}
          className="mb-2"
        />
      )}
      <div className="mt-4 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {data.map((step) => {
            const isCurrentStep = currentStepId === step.id;

            if (!isCurrentStep) return null;

            return (
              <motion.div
                key={step.id}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Activity mode="visible">
                  {step.formMetaData && (
                    <div className="w-full flex justify-between items-center mb-4">
                      <div className="flex flex-col gap-[1px]">
                        <h3 className="font-[700] text-[16px] text-[#251F2D]">
                          {step.formMetaData.heading}
                        </h3>
                        <h5 className="text-[#6B7280] text-[14px] font-[400]">
                          {step.formMetaData.subHeading}
                        </h5>
                      </div>
                      {step.skip &&
                        handleSkip &&
                        (isMobile ? (
                          <button
                            className="text-[#6619DE] font-[600]"
                            onClick={handleSkip}
                          >
                            Skip
                          </button>
                        ) : (
                          <Button
                            variant="outline"
                            className="bg-[#EFE5FE] text-[#6619DE] h-[44px] w-[88px] rounded-[100px]"
                            onClick={handleSkip}
                          >
                            Skip
                          </Button>
                        ))}
                    </div>
                  )}
                  {step.Component?.()}
                </Activity>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default OnboardingWizardFormComponent;
