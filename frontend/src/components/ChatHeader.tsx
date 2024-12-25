import { Hash } from "lucide-react";
import MemberAvatar from "./MemberAvatar";
import { MobileToggle } from "./MobileToggle";
import useAppStore from "@/useAppStore";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export function ChatHeader({
  name,
  serverId,
  type,
  imageUrl,
}: ChatHeaderProps) {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle />
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <MemberAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      {/* <div className="ml-auto flex items-center">
        {type === "conversation" && <ChatVideoButton />}
        <SocketIndicatior />
      </div> */}
    </div>
  );
}
