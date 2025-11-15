import clsx from "clsx";

function AuthLayout({ className, children }: AuthLayoutPropsInt) {
  return (
    <div
      className={clsx(
        "lg:p-8  min-h-svh min-w-full bg-linear-to-br from-[#E4D6FA] via-[#F8F8F9] to-[#F8F8F9]",
        className
      )}
    >
      {children}
    </div>
  );
}

export default AuthLayout;
