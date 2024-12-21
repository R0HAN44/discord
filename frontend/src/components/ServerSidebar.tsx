import { getServerChannelAndMembers } from "@/api/apiController";
import { ChannelType } from "@/lib/utils";
import useAppStore from "@/useAppStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ServerHeader from "./ServerHeader";

const ServerSidebar = () => {
  const { user, activeServer, setActiveServer } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!activeServer) {
      navigate("/");
      return;
    }

    fetchServerChannelsAndMembers();
  }, []);

  async function fetchServerChannelsAndMembers() {
    const response = await getServerChannelAndMembers(activeServer?.id || "");
    setActiveServer(response.server);
  }

  const textChannels = activeServer?.channels?.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = activeServer?.channels?.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = activeServer?.channels?.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = activeServer?.members?.filter(
    (member) => member.profileId !== user?.id
  );

  const role = activeServer?.members?.find(
    (member) => member.profileId === user?.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={activeServer} role={role} />
    </div>
  );
};

export default ServerSidebar;
