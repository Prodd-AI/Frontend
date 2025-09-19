import React from "react";

const AuthCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-[41.875rem] flex flex-col gap-6.5 w-full rounded-auth-card  bg-white p-8 pt-12">
      <section className="flex items-center gap-3">
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
