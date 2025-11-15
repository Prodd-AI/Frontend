const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const hasProperty = <T extends string>(
  obj: Record<string, unknown>,
  prop: T
): obj is Record<T, unknown> => {
  return prop in obj;
};

export const getErrorMessage = (error: unknown): string => {
  // Handle string errors
  if (typeof error === "string") {
    return error.trim() || "Something went wrong. Please try again.";
  }

  // Handle Error instances
  if (error instanceof Error) {
    return error.message || "Something went wrong. Please try again.";
  }

  // Handle object-like errors
  if (isObject(error)) {
    // Check for direct message property
    if (hasProperty(error, "message") && typeof error.message === "string") {
      return error.message;
    }

    // Check for data.message (common in API responses)
    if (
      hasProperty(error, "data") &&
      isObject(error.data) &&
      hasProperty(error.data, "message") &&
      typeof error.data.message === "string"
    ) {
      return error.data.message;
    }

    // Check for response.data.message (Axios-style errors)
    if (
      hasProperty(error, "response") &&
      isObject(error.response) &&
      hasProperty(error.response, "data") &&
      isObject(error.response.data)
    ) {
      if (
        hasProperty(error.response.data, "message") &&
        typeof error.response.data.message === "string"
      ) {
        return error.response.data.message;
      }
      if (
        hasProperty(error.response.data, "error") &&
        typeof error.response.data.error === "string"
      ) {
        return error.response.data.error;
      }
    }

    // Check for error property
    if (hasProperty(error, "error") && typeof error.error === "string") {
      return error.error;
    }

    // Check for statusText (HTTP errors)
    if (
      hasProperty(error, "statusText") &&
      typeof error.statusText === "string"
    ) {
      return error.statusText;
    }
  }

  // Default fallback message
  return "Something went wrong. Please try again.";
};
