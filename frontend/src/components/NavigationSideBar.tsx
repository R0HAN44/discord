import useAppStore from "@/useAppStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationAction from "./NavigationAction";
import { getUserServers } from "@/api/apiController";
import { Separator } from "./ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "./NavigationItem";
import UserAvatar from "./UserAvatar";

const NavigationSideBar = () => {
  const { user, servers, setServers } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchUserServers();
  }, [navigate]);

  async function fetchUserServers() {
    const response = await getUserServers(user?.id || "");
    setServers(response.servers);
  }

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers?.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <UserAvatar name={user?.name || "Discord"} />
      </div>
    </div>
  );
};

export default NavigationSideBar;
