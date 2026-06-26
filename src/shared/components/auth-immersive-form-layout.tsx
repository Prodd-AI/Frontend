import clsx from "clsx";

function AuthImmersiveFormLayout({
  Form,
  title,
  subTitle,
  centralizeText,
  cardClassName,
  footer,
}: AuthImmersiveFormLayoutPropsInt) {
  return (
    <article className={clsx("auth-immersive-card", cardClassName)}>
      <header
        className={clsx(
          "auth-immersive-brand",
          centralizeText && "justify-center text-center",
        )}
      >
        <img
          src="/assets/icons/logo.svg"
          alt="Prodily Logo"
          className="auth-immersive-brand-logo"
        />
        <p className="auth-immersive-brand-name">Prodily</p>
      </header>

      {(title || subTitle) && (
        <div className={clsx("text-center",centralizeText && "text-center")}>
          {title && <h1 className="auth-immersive-title">{title}</h1>}
          {subTitle && (
            <p
              className={clsx(
                "auth-immersive-subtitle",
                centralizeText && "mx-auto max-w-[20rem]",
              )}
            >
              {subTitle}
            </p>
          )}
        </div>
      )}

      {Form}

      {footer}
    </article>
  );
}

export default AuthImmersiveFormLayout;