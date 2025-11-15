import AuthCard from "./cards/auth-card";

function AuthFormLayout({
  Form,
  title,
  subTitle,
  centralizeText,
}: AuthFormLayoutPropsInt) {
  return (
    <div className="flex justify-center sm:px-6 md:px-8 w-full max-w-[41.875rem] h-max">
      <AuthCard centralize={centralizeText}>
        <div>
          <h1
            className={`text-2xl sm:text-3xl text-[#251F2D] font-semibold ${
              centralizeText && "text-center"
            }`}
          >
            {title}
          </h1>
          <p
            className={`text-[#6B7280] font-[500] text-sm sm:text-base mt-2 ${
              centralizeText && "text-center"
            }`}
          >
            {subTitle}
          </p>
        </div>
        {Form && <Form />}
      </AuthCard>
    </div>
  );
}

export default AuthFormLayout;
