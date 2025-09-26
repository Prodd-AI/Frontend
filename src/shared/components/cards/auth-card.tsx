import clsx, { ClassValue } from "clsx";
import React from "react";

const AuthCard = ({
  children,
  className,
  centralize,
}: {
  className?: ClassValue;
  children: React.ReactNode;
  centralize?: boolean;
}) => {
  return (
    <div
      className={clsx(
        "max-w-[41.875rem] min-h-[47.188rem] flex flex-col gap-6.5 w-full sm:rounded-auth-card lg:rounded-auth-card  bg-white p-8 pt-12",
        className
      )}
    >
      <section
        className={`flex items-center gap-3 ${centralize && "justify-center"}
       `}
      >
        <img
          src="/assets/icons/logo.svg"
          alt="ProdAI Logo"
          className="w-6.5 h-6.5"
        ></img>
        <p className="font-semibold text-xl">Prod AI</p>
      </section>
      <>{children}</>
    </div>
  );
};

export default AuthCard;
