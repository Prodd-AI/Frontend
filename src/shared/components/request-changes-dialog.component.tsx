import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface RequestChangesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSendRequest: (description: string) => void;
  isLoading?: boolean;
}

export function RequestChangesDialog({
  isOpen,
  onClose,
  onSendRequest,
  isLoading = false,
}: RequestChangesDialogProps) {
  const [description, setDescription] = useState("");

  const handleSendRequest = () => {
    onSendRequest(description);
    if (!isLoading) {
      setDescription("");
    }
  };

  const handleCancel = () => {
    setDescription("");
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Request Changes
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the changes needed..."
            className="min-h-[120px] resize-none bg-[#F9FAFB] border-gray-200 focus:border-gray-300"
            disabled={isLoading}
          />
        </div>

        <DialogFooter className="mt-6 gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendRequest}
            className="px-6 bg-red-500 hover:bg-red-600 text-white font-medium"
            disabled={isLoading || !description.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RequestChangesDialog;
