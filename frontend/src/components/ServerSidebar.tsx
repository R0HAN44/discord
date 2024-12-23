import { getServerChannelAndMembers } from "@/api/apiController";
import { ChannelType, MemberRole } from "@/lib/utils";
import useAppStore from "@/useAppStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ServerHeader from "./ServerHeader";
import { ScrollArea } from "./ui/scroll-area";
import ServerSearch from "./ServerSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

const iconMap: any = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap: any = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

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
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
