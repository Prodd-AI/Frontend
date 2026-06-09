import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import withAuthGuard from "@/shared/components/HOC/with-auth-guard";

const RegisterPage = lazy(() => import("@/auth/pages/register.page"));

const LoginPage = lazy(() => import("@/auth/pages/login.page"));
const ForgotPassword = lazy(() => import("@/auth/pages/forgot-password.page"));
const ResetPassword = lazy(() => import("@/auth/pages/reset-password.page"));
const SetPassword = lazy(() => import("@/auth/pages/set-password.page"));
const VerfiyEmail = lazy(() => import("@/auth/pages/verify-email.page"));
const PasswordResetSuccess = lazy(
  () => import("@/auth/pages/password-reset-success.page")
);
const GuardedSetPassword = withAuthGuard(SetPassword);

export const auth_routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="login" />,
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
    path: "set-password",
    element: <GuardedSetPassword />,
  },
  {
    path: "verify-email",
    element: <VerfiyEmail />,
  },
  {
    path: "reset-pass-success",
    element: <PasswordResetSuccess />,
  },
];
