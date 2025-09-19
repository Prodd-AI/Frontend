import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const OnboardingPage = lazy(() => import("@/shared/pages/auth/onboarding.page"));

export const onboarding_routes: RouteObject[] = [
  {
    index: true,
    element: <OnboardingPage />,
  },
];
