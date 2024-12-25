import { fetchChannel, fetchMember } from "@/api/apiController";
import { ChatHeader } from "@/components/ChatHeader";
import useAppStore from "@/useAppStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ChannelIdPage = () => {
  const {
    activeServer,
    setActiveChannel,
    setActiveMember,
    activeChannel,
    activeMember,
  } = useAppStore();
  const params = useParams();
  const channelId = params.channelid;
  const navigate = useNavigate();
  useEffect(() => {
    getChannelAndMember();
  }, []);

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
    </div>
  );
};

export default ChannelIdPage;
