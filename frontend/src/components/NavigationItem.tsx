import { cn, stringToColor } from "@/lib/utils";
import ActionTooltip from "./ActionTooltip";
import { useNavigate, useParams } from "react-router-dom";
import PlaceholderImage from "./PlaceholderImage";
import useAppStore from "@/useAppStore";

interface NavigationItemProps {
  id: string;
  imageUrl?: string;
  name: string;
}

const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const { servers, setActiveServer } = useAppStore();
  const onClick = () => {
    const activeserver = servers.find((server) => server.id === id);
    if (!activeserver) {
      console.error("Server not found");
      return;
    }
    console.log(activeserver);
    setActiveServer(activeserver);
    navigate(`/servers/${id}`);
  };
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverid !== id && "group-hover:h-[20px]",
            params?.serverid === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverod === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <PlaceholderImage name={name || "discord"} />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
