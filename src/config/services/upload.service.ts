import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";

const upload_service = new ApiService(`${SERVER_URL}upload`);

const uploadProfileImage = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return upload_service.post<
    GeneralReturnInt<{ url: string; key: string }>,
    FormData
  >("image", formData, true, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export { uploadProfileImage };
