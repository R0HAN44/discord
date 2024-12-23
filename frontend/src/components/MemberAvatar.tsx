import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface MemberAvatarProps {
  src?: string;
  className?: string;
}

const MemberAvatar = ({ src, className }: MemberAvatarProps) => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage
        src={src ? src : "https://avatar.iran.liara.run/public"}
        alt="discord"
      />
    </Avatar>
  );
};

export default MemberAvatar;
