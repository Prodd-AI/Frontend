import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const AuthPage = lazy(() => import("@/shared/pages/auth/auth.page"));
const RegisterPage = lazy(() => import("@/shared/pages/auth/register.page"));

const LoginPage = lazy(() => import("@/shared/pages/auth/login.page"));
const ForgotPassword = lazy(
  () => import("@/shared/pages/auth/forgot-password.page")
);
const ResetPassword = lazy(
  () => import("@/shared/pages/auth/reset-password.page")
);
const VerfiyEmail = lazy(() => import("@/shared/pages/auth/verify-email.page"));
export const auth_routes: RouteObject[] = [
  {
    index: true,
    element: <AuthPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  },
  {
    path: "verify-email",
    element: <VerfiyEmail />,
  },
];
