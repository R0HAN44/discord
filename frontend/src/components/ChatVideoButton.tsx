import { Video, VideoOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ActionTooltip from "./ActionTooltip";

export function ChatVideoButton() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const isVideo = searchParams.get("video");

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";

  const onClick = () => {
    if (isVideo) {
      searchParams.delete("video");
    } else {
      searchParams.set("video", "true");
    }

    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
}
