import clsx from "clsx";

function AuthLayout({ className, children }: AuthLayoutPropsInt) {
  return (
    <div
      className={clsx(
        className,
        "p-8 bg-gradient-to-br from-[#E4D6FA] to-[#F8F8F9] h-svh w-full"
      )}
    >
      {children}
    </div>
  );
}

export default AuthLayout;
