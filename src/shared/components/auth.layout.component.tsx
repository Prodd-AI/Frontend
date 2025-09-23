import clsx from "clsx";

function AuthLayout({ className, children }: AuthLayoutPropsInt) {
  return (
    <div
      className={clsx(
        className,
        "lg:p-8 px-4 py-6.5 h-svh w-full "
      )}
    >
      {children}
    </div>
  );
}

export default AuthLayout;
