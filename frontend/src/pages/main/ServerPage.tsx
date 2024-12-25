import { fetchGeneralChannels } from "@/api/apiController";
import useAppStore from "@/useAppStore";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ServerPage = () => {
  const { activeServer } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!activeServer) {
      navigate("/");
      return;
    }
    getChannels();
  }, []);

  async function getChannels() {
    const response = await fetchGeneralChannels(activeServer?.id);
    const initalChannel = response.server.channels[0];
    if (initalChannel?.name !== "general") {
      return null;
    }
    navigate(`/servers/${activeServer?.id}/channels/${initalChannel.id}`);
    return;
  }

  return (
    <>
      <Loader2 className="animate-spin text-zinc-300 ml-auto w-4 h-4" />
      Loading.....
    </>
  );
};

export default ServerPage;
