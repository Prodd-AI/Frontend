import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";
import axios from "axios";

const upload_service = new ApiService(`${SERVER_URL}upload`);

// The upload endpoint can fail without a JSON body (e.g. 413 from the proxy).
// Map the bare HTTP status to a human-readable message so the UI doesn't
// surface a meaningless network error.
const messageForStatus = (status: number, fallback: string): string => {
  switch (status) {
    case 413:
      return "Image is too large. Please choose a file under 5MB.";
    case 415:
      return "Unsupported image format. Please use JPG, PNG, GIF, or WebP.";
    case 401:
      return "You're not signed in. Please sign in and try again.";
    case 403:
      return "You don't have permission to upload this image.";
    case 408:
    case 504:
      return "Upload timed out. Please check your connection and try again.";
    case 502:
    case 503:
      return "The upload service is temporarily unavailable. Try again shortly.";
    default:
      return fallback;
  }
};

const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    return await upload_service.post<
      GeneralReturnInt<{ url: string; key: string }>,
      FormData
    >("image", formData, true, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      // Some failures (like 413 from the proxy) ship no JSON body, so we
      // can't trust err.response?.data?.message. Always derive from status.
      const fallback =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to upload image.";
      throw new Error(messageForStatus(status, fallback));
    }
    throw err instanceof Error ? err : new Error("Failed to upload image.");
  }
};

export { uploadProfileImage };
