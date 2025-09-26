import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { reset_password_schema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

function ResetPasswordFormComponent() {
  type FormData = z.infer<typeof reset_password_schema>;
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(reset_password_schema),
  });
  const onSubmit = (values: FormData) => {
    console.log(values);
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
          {...register("password")}
          className=" h-[55px] rounded-[10px]"
        />
        {errors.password && (
          <div className=" text-red-500">{errors.password.message}</div>
        )}
      </div>
      <div className=" flex flex-col gap-[9px]">
        <Label htmlFor="password" className=" font-semibold text-[1rem]">
          Confirm New Password
        </Label>
        <Input
          placeholder="Confirm new password"
          id="password"
          {...register("newPassword")}
          className=" h-[55px] rounded-[10px]"
        />
        {errors.newPassword && (
          <div className=" text-red-500">{errors.newPassword.message}</div>
        )}
      </div>
      <Button type="submit" className="h-[40.6px] mt-3">
        Submit
      </Button>
    </form>
  );
}

export default ResetPasswordFormComponent;
