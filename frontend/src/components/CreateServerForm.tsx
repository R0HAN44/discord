import { createServer } from "@/api/apiController";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAppStore from "@/useAppStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { FileInput } from "@/components/ui/file-input";

export default function CreateServerForm({
  dialogTriggerButton,
}: {
  dialogTriggerButton: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState(false);
  const [serverName, setServerName] = useState("");
  const { user } = useAppStore();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName) {
      setError(true);
      setOpen(true);
      return;
    }
    const response = await createServer(serverName, user?.id);
    navigate(`/servers/${response.id}`);
    setOpen(false);
    setError(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {dialogTriggerButton && (
        <DialogTrigger asChild>
          <Button variant="outline">Create Server</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Server</DialogTitle>
          <DialogDescription>
            Enter server details below to create a new server.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serverName" className="text-right">
              Server Name
            </Label>
            <Input
              id="serverName"
              placeholder="Enter server name"
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
              Create Server
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
