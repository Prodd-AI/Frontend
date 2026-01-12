import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Banner from "@/shared/components/banner.component";
import { MdOutlinePhotoCamera, MdCloudUpload } from "react-icons/md";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "../utils/constants";
import { uploadProfileImage } from "@/config/services/upload.service";

const uploadProfilePicture = async (file: File): Promise<UploadResponse> => {
  try {
    const response = await uploadProfileImage(file);
    if (response.data?.url) {
      return { success: true, imageUrl: response.data.url };
    }
    return {
      success: false,
      error: "Failed to upload image. Please try again.",
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
};

function ProfilePictureUploadModal({
  open,
  onOpenChange,
  onUploadSuccess,
}: ProfilePictureUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return "Please select a valid image file (JPG, PNG, GIF, or WebP)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }
    return null;
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setError(null);
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    },
    [validateFile]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleUpload = useCallback(async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadProfilePicture(selectedFile);

      if (response.success && response.imageUrl) {
        onUploadSuccess(response.imageUrl);
        resetState();
        onOpenChange(false);
      } else {
        setError(response.error || "Upload failed. Please try again.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, isUploading, onUploadSuccess, resetState, onOpenChange]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen && !isUploading) {
        resetState();
      }
      onOpenChange(newOpen);
    },
    [isUploading, resetState, onOpenChange]
  );

  const handleChooseFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Banner
              open={true}
              variant="critical"
              description={error}
              isDismiss
              onDismiss={() => setError(null)}
            />
          )}

          {/* File Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
              ${
                isDragging
                  ? "border-primary-color bg-purple-50"
                  : "border-grey-300 hover:border-primary-color/50"
              }
              ${previewUrl ? "bg-grey-50" : "bg-white"}
            `}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 rounded-lg object-cover"
                  />
                </div>
                <p className="text-sm text-grey-600">{selectedFile?.name}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleChooseFile}
                  disabled={isUploading}
                >
                  Choose Different Image
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="size-16 rounded-full bg-purple-100 flex items-center justify-center">
                    <MdCloudUpload className="text-primary-color" size={32} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary mb-1">
                    Drag and drop your image here
                  </p>
                  <p className="text-xs text-grey-600">or</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleChooseFile}
                  disabled={isUploading}
                >
                  <MdOutlinePhotoCamera className="mr-2" size={18} />
                  Choose File
                </Button>
                <p className="text-xs text-grey-600">
                  Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ProfilePictureUploadModal;
