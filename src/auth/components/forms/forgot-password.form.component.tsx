import { ForgotPasswordFormData } from "@/auth/typings/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgot_password_schema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function ForgotPasswordFormComponent() {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgot_password_schema),
  });
  const onSubmit = (values: ForgotPasswordFormData) => {
    console.log(values);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
      <Button type="submit" className=" h-11 sm:h-[2.543rem] md:h-14 w-full">
        Submit
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

export default ForgotPasswordFormComponent;
