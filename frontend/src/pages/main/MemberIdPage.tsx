import { fetchMember } from "@/api/apiController";
import { ChatHeader } from "@/components/ChatHeader";
import { getOrCreateConversation } from "@/lib/conversationUtil";
import useAppStore from "@/useAppStore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function MemberIdPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useAppStore();
  const { memberid, serverid } = params;
  const [otherMember, setOtherMember] = useState<any>();
  useEffect(() => {
    if (!memberid || !user?.id) {
      navigate("/");
      return;
    }
    gOCC();
  }, []);
  async function gOCC() {
    const response = await fetchMember(serverid || "");
    const conversation = await getOrCreateConversation(
      response.member.id,
      memberid || ""
    );
    const { memberOne, memberTwo } = conversation;

    const othMember = memberOne.profileId === user?.id ? memberTwo : memberOne;
    setOtherMember(othMember);
    if (!conversation) return navigate(`/servers/${serverid}`);
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember?.profile?.imageUrl}
        name={otherMember?.profile?.name || "Other Member"}
        serverId={serverid || ""}
        type="conversation"
      />
      {/* {video && <MediaRoom chatId={conversation?.id} video audio />} */}
      {/* {!video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )} */}
    </div>
  );
}
