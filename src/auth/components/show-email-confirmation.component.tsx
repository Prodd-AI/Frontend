import AuthImmersiveFormLayout from "@/shared/components/auth-immersive-form-layout";
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
    <AuthImmersiveFormLayout
      centralizeText
      Form={
        <div className="flex flex-col items-center gap-4">
          <div className="auth-immersive-status-icon">
            <EmailIcon />
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h2 className="auth-immersive-status-title">Email Confirmation</h2>
            <p className="auth-immersive-status-copy max-w-[18rem]">
              We have sent email to <b>{email}</b> to confirm the validity of
              our email address. After receiving the email follow the link
              provided to complete you registration
            </p>
          </div>

          <p className="auth-immersive-status-copy text-center">
            Didn’t receive a link?{" "}
            <button
              className={`font-semibold text-[#6619DE] hover:underline ${
                isResendCoolDown
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              onClick={handleResendLink}
              disabled={isResendCoolDown}
            >
              Click here to resend
            </button>
          </p>
          {isResendCoolDown && (
            <span className="text-xs text-[#6B7280]">
              Resend in {resendCooldown}s
            </span>
          )}
        </div>
      }
    />
  );
}

export default ShowEmailConfirmation;