import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const OnboardingPage = lazy(() => import("@/shared/pages/onboarding.page.tsx"));

export const onboarding_routes: RouteObject[] = [
  {
    index: true,
    element: <OnboardingPage />,
  },
];
