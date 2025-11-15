import AuthFormLayout from "@/shared/components/auth-form-layout";
import { UseMutateFunction } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import EmailIcon from "@/components/ui/email-icon";

interface ShowEmailConfirmationPropsInt {
  email: string;
  mutate: UseMutateFunction<
    GeneralReturnInt<unknown>,
    GeneralErrorInt,
    {
      email: string;
    },
    unknown
  >;
}

function ShowEmailConfirmation({
  email,
  mutate,
}: ShowEmailConfirmationPropsInt) {
  const [resendCooldown, setResendCooldown] = useState(0);
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const clearResendCoolDownInterval = setInterval(() => {
      setResendCooldown(resendCooldown - 1);
    }, 1000);

    return () => clearInterval(clearResendCoolDownInterval);
  }, [resendCooldown]);

  const handleResendLink = () => {
    setResendCooldown(60);
    mutate({ email });
  };
  const isResendCoolDown = resendCooldown > 0;
  return (
    <AuthFormLayout
      authCardClassName=" !max-w-[41.875rem] !min-h-[35.563rem] "
      Form={
        <div className="flex flex-col items-center">
          <div className="size-[118px] bg-[#6619DE1A] rounded-full flex justify-center items-center">
            <EmailIcon />
          </div>
          <div className=" flex flex-col items-center mt-[1.5rem] gap-[9px]">
            <h2 className=" text-[1.75rem] font-[600] text-[#251F2D]">
              Email Confirmation
            </h2>
            <p className=" text-[1rem] text-[#6B7280] text-center w-3/4">
              We have sent email to <b>{email} </b> to confirm the validity of
              our email address. After receiving the email follow the link
              provided to complete you registration
            </p>
          </div>

          <p className=" mt-[4.625rem] text-[1rem] text-[#6B7280]">
            Didn’t receive a link?{" "}
            <button
              className={`text-[#6619DE] font-semibold hover:underline cursor-pointer ${
                isResendCoolDown && "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleResendLink}
              disabled={isResendCoolDown}
            >
              Click here to resend
            </button>
          </p>
          {isResendCoolDown && <span>Resend in {resendCooldown}s</span>}
        </div>
      }
    />
  );
}

export default ShowEmailConfirmation;
