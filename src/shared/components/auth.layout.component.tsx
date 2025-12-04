import clsx from "clsx";
import { AuthLayoutPropsInt } from "@/shared/typings/auth.layout";

function AuthLayout({ className, children }: AuthLayoutPropsInt) {
  return (
    <div
      className={clsx(
        className,
        "lg:p-8 flex justify-center  w-full bg-linear-to-br from-[#E4D6FA] via-[#F8F8F9] to-[#F8F8F9] min-h-screen h-max"
      )}
    >
      {children}
    </div>
  );
}

export default AuthLayout;
