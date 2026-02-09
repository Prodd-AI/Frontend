import type { WelcomeBackHeaderPropsInt } from "@/shared/typings/welcome-back-header";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import { CiHeart } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";

interface NudgeBannerPropsInt extends WelcomeBackHeaderPropsInt {
  isDismissable?: boolean;
  onDismiss?: () => void;
  open?: boolean;
  autoShowIntervalMs?: number;
  setOpen?: (open: boolean) => void;
}

function NudgeBanner({
  heading,
  subHeading,
  child,
  className,
  isDismissable,
  onDismiss,
  open = false,
  autoShowIntervalMs,
  setOpen,
}: NudgeBannerPropsInt) {
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    if (!autoShowIntervalMs || !setOpen) return;

    const intervalId = setInterval(() => {
      if (!openRef.current) {
        setOpen(true);
      }
    }, autoShowIntervalMs);

    return () => clearInterval(intervalId);
  }, [autoShowIntervalMs, setOpen]);

  if (!open) return null;
  return (
    <aside
      role="banner"
      aria-label="Nudge Banner"
      className={clsx(
        "px-6 py-7 min-h-[7.125rem] flex flex-col sm:flex-row justify-between sm:items-center border rounded-[12px] bg-linear-to-r from-[#E0D2F5] to-[#E1F0FB]  shadow-[0px_4px_4px_-4px_rgba(12,12,13,0.05),0px_16px_16px_-8px_rgba(12,12,13,0.1)]",
        className,
      )}
    >
      <div className="flex items-center gap-6">
        <span className=" size-[58px] rounded-full  justify-center items-center bg-[#934DFF2B] hidden sm:flex">
          <CiHeart size={27} className=" text-[#6619DE]" />
        </span>
        <div className="flex flex-col-reverse sm:flex-col">
          <h4 className="text-[#41384D] font-[600] sm:font-bold text-[1rem]">
            {heading}
          </h4>
          <div className="flex items-center justify-between">
            <p className="text-[#444D5E] text-[1rem] font-medium">
              {subHeading}
            </p>
            {isDismissable && (
              <button
                onClick={onDismiss}
                className="sm:p-2 sm:hidden cursor-pointer text-[#6B7280] rounded-full transition-all duration-200 hover:bg-[#F3F4F6] hover:text-[#EF4444] hover:scale-110  "
              >
                <RxCross2 size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-5">
        {child}
        {isDismissable && (
          <button
            onClick={onDismiss}
            className="sm:p-2 cursor-pointer text-[#6B7280] rounded-full transition-all duration-200 hover:bg-[#F3F4F6] hover:text-[#EF4444] hover:scale-110 hidden sm:block"
          >
            <RxCross2 size={24} />
          </button>
        )}
      </div>
    </aside>
  );
}

export default NudgeBanner;
