export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    const anyErr = error as any;
    const msg =
      anyErr?.message ||
      anyErr?.data?.message ||
      anyErr?.response?.data?.message ||
      anyErr?.error ||
      anyErr?.statusText;
    if (typeof msg === "string") return msg;
  }
  return "Something went wrong. Please try again.";
};
