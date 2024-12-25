import { createChannel, createServer, editChannel } from "@/api/apiController";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAppStore, { useModal } from "@/useAppStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export enum ChannelType {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

export default function EditChannelModal() {
  const [error, setError] = useState(false);
  const [channelNameError, setChannelNameError] = useState(false);
  const [channelTypeError, setChannelTypeError] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channeltype, setChanneltype] = useState<ChannelType>(ChannelType.TEXT);
  const { user } = useAppStore();
  const navigate = useNavigate();
  const { setActiveServer, activeServer, servers, setServers } = useAppStore();
  const { isOpen, onClose, type, data, channelType, channel } = useModal();
  const server = activeServer || data;

  const isModalOpen = isOpen && type === "editChannel";

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!channelName) {
      setError(true);
      hasError = true;
    }

    if (channelName.toLowerCase() === "general") {
      setChannelNameError(true);
      hasError = true;
    }

    if (!channeltype) {
      setChannelTypeError(true);
      hasError = true;
    }

    if (hasError) return;

    const response = await editChannel(
      channel.id,
      channelName,
      channeltype,
      server.id
    );
    setActiveServer(response.server);
    const updatedServers = servers.map((server) =>
      server.id === response.server.id
        ? { ...server, name: response.server.name }
        : server
    );
    setServers(updatedServers);
    setChannelName("");
    setChanneltype(ChannelType.TEXT);
    onClose();
    setError(false);
    setChannelTypeError(false);
  };

  const handleClose = () => {
    setChannelName("");
    setChanneltype(ChannelType.TEXT);
    onClose();
  };

  useEffect(() => {
    if (channel) {
      setChannelName(channel.name);
      setChanneltype(channel.type);
    }
  }, [channel]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] z-[9000]">
        <DialogHeader>
          <DialogTitle>Edit Channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="channelName" className="text-right">
              Channel Name
            </Label>
            <Input
              id="channelName"
              placeholder="Enter Channel name"
              className="col-span-3"
              value={channelName}
              onChange={(e) => {
                if (e.target.value) {
                  setError(false);
                }
                if (e.target.value.toLowerCase() === "general") {
                  setChannelName(e.target.value);
                  setChannelNameError(true);
                  return;
                } else {
                  setChannelNameError(false);
                }
                setChannelName(e.target.value);
              }}
            />
          </div>
          {error && (
            <div className="text-red-500 flex items-center justify-center text-sm">
              Channel name is required
            </div>
          )}
          {channelNameError && (
            <div className="text-red-500 flex items-center justify-center text-sm">
              Channel name cannot be 'General'
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="channelType" className="text-right">
              Channel Type
            </Label>
            <Select
              onValueChange={(value) => {
                setChanneltype(value as ChannelType);
                setChannelTypeError(false);
              }}
              value={channeltype}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select channel type" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  <SelectItem value={ChannelType.TEXT}>Text</SelectItem>
                  <SelectItem value={ChannelType.AUDIO}>Audio</SelectItem>
                  <SelectItem value={ChannelType.VIDEO}>Video</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {channelTypeError && (
            <div className="text-red-500 flex items-center justify-center text-sm">
              Channel type is required
            </div>
          )}
          <DialogFooter>
            <Button disabled={error || channelTypeError} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
