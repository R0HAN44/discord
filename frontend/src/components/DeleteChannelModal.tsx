import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useAppStore, { useModal } from "@/useAppStore";
import { useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { deleteChannel } from "@/api/apiController";

export default function DeleteChannelModal() {
  const { isOpen, onClose, type, data, channel } = useModal();
  const { servers, setServers, setActiveServer } = useAppStore();

  const isModalOpen = isOpen && type === "deleteChannel";
  const [isLoading, setIsLoading] = useState(false);

  const server = data;
  const navigate = useNavigate();

  const onConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await deleteChannel(channel.id, server.id);
      console.log(response);
      if (response.success) {
        const updatedServers = servers.filter((ser) => ser.id !== server.id);
        setActiveServer(response.server);
        setServers(updatedServers);
        navigate(`/servers/${server?.id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-rose-500 mb-2">
            Delete Channel
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-200">
            Are you sure you want to Delete{" "}
            <span className="font-semibold text-indigo-500">
              #{channel?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-900 px-2 py-2 border rounded-lg">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onConfirm}
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
