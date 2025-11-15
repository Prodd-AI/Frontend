import { ResetPasswordFormData } from "@/auth/typings/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { reset_password } from "@/config/services/auth.service";
import { reset_password_schema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Link } from "react-router-dom";

function ResetPasswordFormComponent({
  setShowPasswordResetSuccess,
}: ResetPasswordFormComponentPropsInt) {
  const [searchParam] = useSearchParams();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(reset_password_schema),
  });
  const { mutate, isPending } = useMutation<
    GeneralReturnInt<unknown>,
    GeneralErrorInt,
    {
      new_password: string;
      confirm_password: string;
      token: string;
    }
  >({
    mutationFn: (data) => reset_password(data),
    onSuccess: (res) => {
      toast.success(res.message);
      setTimeout(() => {
        setShowPasswordResetSuccess(true);
      }, 500);
    },
  });

  const token = searchParam.get("token");
  const onSubmit = (values: ResetPasswordFormData) => {
    console.log(values);
    if (!token) return;
    const transformedData = Object.assign(
      {
        token,
      },
      values
    );

    mutate(transformedData);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" flex flex-col gap-[19px]"
    >
      <div className=" flex flex-col gap-[9px]">
        <Label htmlFor="password" className=" font-semibold text-[1rem]">
          Enter New Password
        </Label>
        <Input
          placeholder="New password"
          id="password"
          {...register("new_password")}
          className=" h-[55px] rounded-[10px]"
        />
        {errors.new_password && (
          <div className=" text-red-500">{errors.new_password.message}</div>
        )}
      </div>
      <div className=" flex flex-col gap-[9px]">
        <Label htmlFor="password" className=" font-semibold text-[1rem]">
          Confirm New Password
        </Label>
        <Input
          placeholder="Confirm new password"
          id="conmfirm-password"
          {...register("confirm_password")}
          className=" h-[55px] rounded-[10px]"
        />
        {errors.confirm_password && (
          <div className=" text-red-500">{errors.confirm_password.message}</div>
        )}
      </div>
      <Button
        type="submit"
        className={`h-11 sm:h-[2.543rem] md:h-14 mt-3 ${isPending && "opacity-50"}`}
      >
        {isPending ? "Submitting...." : "Submit"}
      </Button>

      <p className="text-center mt-[19px] font-[600] text-[1rem]">
        Go back to{" "}
        <Link
          to="/auth/login"
          className=" text-[#6619DE] hover:underline transition-all duration-300"
        >
          Login
        </Link>
      </p>
    </form>
  );
}

export default ResetPasswordFormComponent;
