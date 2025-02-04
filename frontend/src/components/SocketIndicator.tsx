import { useEffect } from "react";
import useAppStore from "@/useAppStore";
import { Badge } from "./ui/badge";

const SocketIndicator = () => {
  const { connectSocket, disconnectSocket, isConnected } = useAppStore();

  useEffect(() => {
    if (!isConnected) {
      connectSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <Badge
      variant="outline"
      className={
        isConnected ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
      }
    >
      {isConnected ? "Connected" : "Disconnected"}
    </Badge>
  );
};

export default SocketIndicator;
