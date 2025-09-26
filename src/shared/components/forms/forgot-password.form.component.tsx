import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgot_password_schema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

function ForgotPasswordFormComponent() {
  type FormData = z.infer<typeof forgot_password_schema>;
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>({
    resolver: zodResolver(forgot_password_schema),
  });
  const onSubmit = (values: FormData) => {
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
      <Button type="submit" className=" h-[40.7px] w-full">
        Submit
      </Button>
    </form>
  );
}

export default ForgotPasswordFormComponent;
