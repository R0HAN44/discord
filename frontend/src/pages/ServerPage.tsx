import UserAvatar from "@/components/UserAvatar";
import useAppStore from "@/useAppStore";

const ServerPage = () => {
  const { activeServer } = useAppStore();
  return (
    <div>
      ServerPage
      <p>active server : {activeServer?.id}</p>
      <UserAvatar />
    </div>
  );
};

export default ServerPage;
