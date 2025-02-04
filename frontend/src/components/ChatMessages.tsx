import { Fragment, useRef, ElementRef, useEffect, useState } from "react";
import { Loader2, ServerCrash } from "lucide-react";
import { ChatWelcome } from "./ChatWelcome";
import { getMessages } from "@/api/apiController";
import { format } from "date-fns";
import { ChatItem } from "./ChatItem";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

interface Message {
  id: string;
  content: string;
  fileUrl?: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

import { MemberRole } from "@/lib/utils";

interface Member {
  id: string;
  profile: Profile;
  role: MemberRole;
  profileId: string;
  serverId: string;
  server: string;
  createdAt: string;
  updatedAt: string;
}

interface Profile {
  id: string;
  name: string;
  userId: string;
  imageUrl: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  servers: any[];
  members: any[];
  channels: any[];
}

type MessagesWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export function ChatMessages({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) {
  const [messages, setMessages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const fetchMessages = async (currentCursor: string | null = null) => {
    try {
      setIsLoading(true);
      const url = `${apiUrl}?${paramKey}=${paramValue}${
        currentCursor ? `&cursor=${currentCursor}` : ""
      }`;
      console.log(url);
      const response = await getMessages(url);

      // Check if response.messages exists and is an array
      if (!response?.messages || !Array.isArray(response.messages)) {
        throw new Error("Invalid response format");
      }

      setMessages((prevMessages: any) => {
        const newMessages = currentCursor
          ? [...prevMessages, ...response.messages]
          : response.messages;

        // Remove duplicates based on message ID
        return Array.from(
          new Map(newMessages.map((item: any) => [item.id, item])).values()
        );
      });

      // Update pagination state based on response
      setHasMore(response.hasNextPage || false);
      setCursor(response.nextCursor || null);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [apiUrl, paramKey, paramValue]);

  useEffect(() => {
    // Scroll to bottom on initial load
    if (messages.length > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (error) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
      {hasMore && (
        <div className="flex justify-center">
          {isLoading ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchMessages(cursor)}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      {!hasMore && <ChatWelcome name={name} type={type} />}

      <div className="flex flex-col-reverse mt-auto">
        {messages?.map((message: any) => (
          <ChatItem
            key={message.id}
            // @ts-ignore
            currentMember={member}
            member={message.member}
            id={message.id}
            content={message.content}
            fileUrl={message.fileUrl}
            deleted={message.deleted}
            timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
            isUpdated={message.updatedAt !== message.createdAt}
            socketQuery={socketQuery}
            socketUrl={socketUrl}
          />
        ))}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
