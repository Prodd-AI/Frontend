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

import { useState } from "react";
import { verify_email_schema } from "@/lib/schemas";
import { VerifyEmailFormData } from "@/auth/typings/auth";
//import useAuthStore from "@/config/stores/auth.store";
import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "@/config/services/auth.service";

function VerifyEmailFormComponent() {
  const [isResending, setIsResending] = useState(false);

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
  //  const invite_otp = useAuthStore((state) => state.invite_otp);

  const onSubmit = (values: VerifyEmailFormData) => {
    console.log("Verify email submit:", values);
    // TODO: Integrate with API to verify the code
  };
  useMutation<
    GeneralReturnInt<unknown>,
    unknown,
    { email: string; otp: string }
  >({
    mutationFn: (data) => verifyEmail(data),
  });

  const handleResendCode = async () => {
    setIsResending(true);
    console.log("Resending verification code...");
    // TODO: Integrate with API to resend verification code

    // Simulate API call delay
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 items-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#000000] mb-2">
            Enter Code
          </h3>
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
            <p className="text-red-500 text-sm">{errors.code.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          className="h-11 sm:h-[2.543rem] lg:w-[70%] lg:mx-auto"
        >
          Verify Email
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            className="text-[#6619DE] hover:underline text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? "Resending..." : "Resend Code"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default VerifyEmailFormComponent;
