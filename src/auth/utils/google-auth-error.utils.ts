import type { ApiError } from "@/config/services/root.service";
import { getErrorMessage } from "@/shared/utils/error-message.utils";

const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "isNetworkError" in error &&
    typeof (error as ApiError).message === "string"
  );
};

export const getGoogleAuthErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    if (error.status === 401) {
      return "Google sign-in failed. Please try again.";
    }

    if (error.status === 409) {
      return "This email is already linked to another Google account.";
    }

    if (error.isNetworkError) {
      return "We couldn't reach our servers. Please check your internet connection and try again.";
    }
  }

  return getErrorMessage(error);
};