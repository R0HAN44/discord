import { updateServerDetails } from "@/api/apiController";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAppStore, { useModal } from "@/useAppStore";
import { useEffect, useState } from "react";
// import { FileInput } from "@/components/ui/file-input";

export default function EditServerModal() {
  const [error, setError] = useState(false);
  const [serverName, setServerName] = useState("");
  const { setActiveServer, setServers, servers } = useAppStore();
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "editserver";

  useEffect(() => {
    console.log(data);
    if (data.name) {
      setServerName(data.name);
    }
  }, [data]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName) {
      setError(true);
      return;
    }
    try {
      // Update server details
      const response = await updateServerDetails(serverName, data.id);

      if (response.success) {
        // Update the active server
        setActiveServer(response.server);

        const updatedServers = servers.map((server) =>
          server.id === response.server.id
            ? { ...server, name: response.server.name }
            : server
        );
        setServers(updatedServers);
        // Reset state
        setServerName("");
        onClose();
        setError(false);
      } else {
        console.error("Failed to update server:", response.message);
      }
    } catch (error) {
      console.error("Error updating server:", error);
    }
  };

  const handleClose = () => {
    setServerName("");
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] z-[9999]">
        <DialogHeader>
          <DialogTitle>Customize Server</DialogTitle>
          <DialogDescription>Edit the server details below</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serverName" className="text-right">
              Server Name
            </Label>
            <Input
              id="serverName"
              placeholder="Edit server name"
              className="col-span-3"
              value={serverName}
              onChange={(e) => {
                if (e.target.value) {
                  setError(false);
                }
                setServerName(e.target.value);
              }}
            />
          </div>
          {error && (
            <div className="text-red-500 flex items-center justify-center text-sm">
              Server name is required
            </div>
          )}
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serverIcon" className="text-right">
              Server Icon
            </Label>
            <FileInput id="serverIcon" placeholder="Upload server icon" />
          </div> */}
          <DialogFooter>
            <Button disabled={error} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
