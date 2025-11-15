declare module "@/shared/typings/auth.layout" {
  import { ClassValue } from "clsx";
  import { ReactNode } from "react";

  export interface AuthLayoutPropsInt {
    className?: ClassValue;
    children: ReactNode;
  }
}
