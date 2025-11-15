import { ForgotPasswordFormData } from "@/auth/typings/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgot_password_schema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "@tanstack/react-query";

import { useForm } from "react-hook-form";

interface ForgotPasswordFormComponentPropsInt {
  email: string;
  isPending: boolean;
  mutate: UseMutateFunction<
    GeneralReturnInt<unknown>,
    GeneralErrorInt,
    {
      email: string;
    },
    unknown
  >;
}
function ForgotPasswordFormComponent({
  email,
  isPending,
  mutate,
}: ForgotPasswordFormComponentPropsInt) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgot_password_schema),
    defaultValues: {
      email: email ?? "",
    },
  });

  const ForgotPasswordOnSubmit = (values: ForgotPasswordFormData) => {
    mutate(values);
  };

  return (
    <form
      onSubmit={handleSubmit(ForgotPasswordOnSubmit)}
      className="flex flex-col gap-[30px]"
    >
      <div className="flex flex-col gap-[9px]">
        <Label htmlFor="email" className=" text-[1rem] font-semibold">
          Email Address
        </Label>
        <Input
          id="email"
          placeholder="e.g johndoe@gmail.com"
          type="email"
          {...register("email")}
          className=" h-[55px] rounded-[10px]"
        />
        {errors.email && (
          <div className=" text-red-500">{errors.email.message}</div>
        )}
      </div>
      <Button
        type="submit"
        className={`h-[40.7px] w-full ${isPending && "opacity-50"}`}
        disabled={isPending}
      >
        {isPending ? "Submitting....." : "Submit"}
      </Button>
    </form>
  );
}

export default ForgotPasswordFormComponent;
