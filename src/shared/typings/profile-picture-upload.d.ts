interface ProfilePictureUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: (imageUrl: string) => void;
}

interface UploadResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}
