import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState, useEffect } from "react";
import { verify_email_schema } from "@/lib/schemas";
import { VerifyEmailFormData } from "@/auth/typings/auth";
import useAuthStore from "@/config/stores/auth.store";
import { useMutation } from "@tanstack/react-query";
import { resend_otp, verify_email } from "@/config/services/auth.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const RESEND_COOLDOWN = 60; // 60 seconds cooldown
import { Link } from "react-router-dom";
import { TeamMember } from "@/shared/typings/team-member";

function VerifyEmailFormComponent() {
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verify_email_schema),
    defaultValues: {
      code: "",
    },
  });
  const navigate = useNavigate();
  const { email, login } = useAuthStore();

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Verify email mutation
  const { mutate, isPending } = useMutation<
    GeneralReturnInt<TeamMember>,
    Error,
    { email: string; otp: string }
  >({
    mutationFn: (data) => verify_email(data),
    onSuccess: (res) => {
      toast.success("Verification Complete. Redirecting you to your Dashboard");
      login(res.data, res.data?.access_token);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },
    onError(error) {
      console.error(error);
    },
  });

  // Resend OTP mutation
  const { mutate: resendMutate, isPending: isResending } = useMutation<
    GeneralReturnInt<string>,
    Error,
    { email: string }
  >({
    mutationFn: (email) => resend_otp(email),
    onSuccess: () => {
      toast.success("Verification code resent successfully!");
      setResendCooldown(RESEND_COOLDOWN);
    },
    onError(error) {
      console.error(error);
    },
  });

  const onSubmit = (values: VerifyEmailFormData) => {
    mutate({
      otp: values.code,
      email: email ?? "",
    });
  };

  const handleResendCode = () => {
    if (resendCooldown > 0) return;
    resendMutate({ email: email ?? "" });
  };

  const isResendDisabled = isResending || resendCooldown > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 items-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#000000] mb-2">
            Enter Verification Code
          </h3>
          <p className="text-sm text-gray-600">
            We sent a 6-digit code to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <Label htmlFor="verification-code" className="sr-only">
            Verification Code
          </Label>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
              >
                <InputOTPGroup className="gap-2 w-[350px] lg:w-full sm:w-full">
                  <InputOTPSlot
                    index={0}
                    className="size-[60px] text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={1}
                    className="size-[60px] text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={2}
                    className="size-[60px] text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={3}
                    className="size-[60px] text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={4}
                    className="size-[60px] text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={5}
                    className="size-[60px] text-lg font-semibold"
                  />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          className="h-11 sm:h-[2.543rem] md:h-14 lg:w-[70%] lg:mx-auto"
          disabled={isPending}
        >
          {isPending ? "Verifying..." : "Verify Email"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResendDisabled}
            className="text-[#6619DE] hover:underline text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isResending
              ? "Resending..."
              : resendCooldown > 0
              ? `Resend Code (${resendCooldown}s)`
              : "Resend Code"}
          </button>
        </div>

        <p className="text-center mt-[19px] font-[600] text-[1rem]">
          Go back to{" "}
          <Link
            to="/auth/login"
            className=" text-[#6619DE] hover:underline transition-all duration-300"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}

export default VerifyEmailFormComponent;
