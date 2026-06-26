import clsx from "clsx";

function AuthImmersiveLayout({
  className,
  children,
}: AuthImmersiveLayoutPropsInt) {
  return (
    <div
      className={clsx("auth-immersive-shell", className)}
    >
      <div className="flex w-full justify-center">{children}</div>
    </div>
  );
}

export default AuthImmersiveLayout;