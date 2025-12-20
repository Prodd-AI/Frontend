

declare module "@/shared/typings/welcome-back-header" {
  import { ClassValue } from "clsx";
  import { ReactNode } from "react";

export interface WelcomeBackHeaderPropsInt {
  heading?: string;
  subHeading?: string;
  badge?: boolean;
  child?: ReactNode;
  className?: ClassValue;
}

  
}