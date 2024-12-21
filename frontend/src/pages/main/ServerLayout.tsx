import ServerSidebar from "@/components/ServerSidebar";
import useAppStore from "@/useAppStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ServerLayout = ({ children }: { children: React.ReactNode }) => {
  const { activeServer } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!activeServer) {
      navigate("/");
      return;
    }
  }, []);
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerLayout;
