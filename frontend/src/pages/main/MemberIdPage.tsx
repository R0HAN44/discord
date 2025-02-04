import { fetchMember } from "@/api/apiController";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatInput } from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import { MediaRoom } from "@/components/MediaRoom";
import { getOrCreateConversation } from "@/lib/conversationUtil";
import useAppStore from "@/useAppStore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function MemberIdPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user, socket, connectSocket, sendSocketEvent } = useAppStore();
  const { memberid, serverid } = params;
  const [otherMember, setOtherMember] = useState<any>();
  const [conversation, setConversation] = useState<any>();

  useEffect(() => {
    if (!memberid || !user?.id) {
      navigate("/");
      return;
    }
    initializeConversation();
  }, [memberid, user?.id]);

  // Initialize socket connection when component mounts
  useEffect(() => {
    if (!socket) {
      connectSocket();
    }

    return () => {
      // Clean up socket event listeners when component unmounts
      if (socket) {
        socket.off("direct_message");
        socket.off("conversation_update");
      }
    };
  }, [socket]);

  // Set up socket event listeners when conversation is established
  useEffect(() => {
    if (socket && conversation?.id) {
      // Join the conversation room
      sendSocketEvent("join_conversation", {
        conversationId: conversation.id,
      });

      // Listen for new messages
      socket.on("direct_message", (message: any) => {
        // Handle new message
        console.log("New direct message received:", message);
        // Update your messages state here
      });

      // Listen for conversation updates
      socket.on("conversation_update", (update: any) => {
        // Handle conversation updates (typing indicators, read receipts, etc.)
        console.log("Conversation update:", update);
      });
    }
  }, [socket, conversation]);

  async function initializeConversation() {
    console.log("inside initailizd");
    try {
      const response = await fetchMember(serverid || "");
      console.log("Member response:", response);

      const conversationData = await getOrCreateConversation(
        response?.member?.id,
        memberid || ""
      );
      console.log("conversation data", conversationData);
      if (!conversationData) {
        navigate(`/servers/${serverid}`);
        return;
      }

      setConversation(conversationData);
      const { memberOne, memberTwo } = conversationData;

      const othMember =
        memberOne.profileId === user?.id ? memberTwo : memberOne;
      setOtherMember(othMember);

      // Join the socket room for this conversation
      if (socket) {
        sendSocketEvent("join_conversation", {
          conversationId: conversationData.id,
        });
      }
    } catch (error) {
      console.error("Error initializing conversation:", error);
      navigate(`/servers/${serverid}`);
    }
  }

  // Function to send a message
  const sendMessage = (content: string) => {
    if (socket && conversation?.id) {
      sendSocketEvent("direct_message", {
        conversationId: conversation.id,
        content,
        receiverId: otherMember?.profileId,
      });
    }
  };

  // Function to handle typing indicators
  const handleTyping = (isTyping: boolean) => {
    if (socket && conversation?.id) {
      sendSocketEvent("typing_indicator", {
        conversationId: conversation.id,
        isTyping,
        userId: user?.id,
      });
    }
  };

  const searchParams = new URLSearchParams(location.search);
  const video = searchParams.get("video");

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember?.profile?.imageUrl}
        name={otherMember?.profile?.name || "Other Member"}
        serverId={serverid || ""}
        type="conversation"
      />
      {video && <MediaRoom chatId={conversation?.id} video audio />}
      {!video && (
        <>
          <ChatMessages
            //@ts-ignore
            member={user}
            name={otherMember?.profile?.name}
            chatId={conversation?.id}
            type="conversation"
            apiUrl="/api/direct-messages/messages"
            socketUrl="/api/direct-messages/messages"
            paramKey="conversationId"
            paramValue={conversation?.id}
            socketQuery={{
              conversationId: conversation?.id,
            }}
          />
          <ChatInput
            name={otherMember?.profile?.name}
            type="conversation"
            apiUrl="/api/direct-messages/messages"
            query={{
              conversationId: conversation?.id,
            }}
            isConv={true}
          />
        </>
      )}
    </div>
  );
}
