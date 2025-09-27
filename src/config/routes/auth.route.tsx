import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";

const RegisterPage = lazy(() => import("@/auth/pages/register.page"));

const LoginPage = lazy(() => import("@/auth/pages/login.page"));
const ForgotPassword = lazy(() => import("@/auth/pages/forgot-password.page"));
const ResetPassword = lazy(() => import("@/auth/pages/reset-password.page"));
const VerfiyEmail = lazy(() => import("@/auth/pages/verify-email.page"));
export const auth_routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to='login' />,
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
