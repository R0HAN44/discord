import { fetchChannel, fetchMember } from "@/api/apiController";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessages } from "@/components/ChatMessages";
import { MediaRoom } from "@/components/MediaRoom";
import { ChannelType } from "@/lib/utils";
import useAppStore from "@/useAppStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ChannelIdPage = () => {
  const {
    activeMember,
    activeServer,
    setActiveChannel,
    setActiveMember,
    activeChannel,
  } = useAppStore();
  const params = useParams();
  const channelId = params?.channelid;
  const navigate = useNavigate();
  useEffect(() => {
    getChannelAndMember();
  }, [channelId]);

  async function getChannelAndMember() {
    const channelResponse = await fetchChannel(channelId || "");
    const memberResponse = await fetchMember(activeServer?.id);
    if (!channelResponse.channel || !memberResponse.member) {
      return navigate("/");
    }
    setActiveChannel(channelResponse.channel);
    setActiveMember(memberResponse.member);
  }
  return (
    <div className="bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={activeChannel?.name || ""}
        serverId={activeChannel?.serverId}
        type="channel"
      />
      {activeChannel?.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={activeMember}
            name={activeChannel?.name || ""}
            chatId={channelId || ""}
            type="channel"
            apiUrl="/api/message/messages"
            socketUrl="/api/message/messages"
            socketQuery={{
              channelid: channelId || "",
              serverid: activeServer?.id || "",
            }}
            paramKey="channelId"
            paramValue={channelId || ""}
          />
          <ChatInput
            name={activeChannel?.name || ""}
            type="channel"
            apiUrl="/api/message/messages"
            query={{ channelid: channelId, serverid: activeServer?.id }}
            isConv={false}
          />
        </>
      )}
      {activeChannel?.type === ChannelType.AUDIO && (
        <MediaRoom chatId={activeChannel.id} video={false} audio={true} />
      )}
      {activeChannel?.type === ChannelType.VIDEO && (
        <MediaRoom chatId={activeChannel.id} video={true} audio={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;
