import clsx from "clsx";

function AuthLayout({ className, children }: AuthLayoutPropsInt) {
  return (
    <div
      className={clsx(
        className,
        "lg:p-8  h-svh w-full bg-linear-to-br from-[#E4D6FA] via-[#F8F8F9] to-[#F8F8F9] "
      )}
    >
      {children}
    </div>
  );
}

export default AuthLayout;
