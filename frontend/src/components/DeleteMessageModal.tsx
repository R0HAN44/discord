import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/useAppStore";
import { deleteMessage } from "@/api/apiController";

export function DeleteMessageModal() {
  const {
    isOpen,
    onClose,
    type,
    data: { apiUrl, query },
  } = useModal();

  const isModalOpen = isOpen && type === "deleteMessage";

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const queryString = new URLSearchParams(query).toString();
      const url = `${apiUrl}?${queryString}`;
      const response = await deleteMessage(url);
      console.log(response);

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-rose-500 mb-2">
            Delete Message
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-200">
            Are you sure you want to Delete
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-900 px-2 py-2 border rounded-lg">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onClick}
              variant="destructive"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
