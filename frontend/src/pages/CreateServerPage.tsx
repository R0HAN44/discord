import UserAvatar from "@/components/UserAvatar";
import useAppStore from "@/useAppStore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getUserServer } from "@/api/apiController";
import CreateServerForm from "@/components/CreateServerForm";

const CreateServerPage = () => {
  const navigate = useNavigate();
  const { user, activeServer, setActiveServer } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!user || !token) {
      navigate("/signup", { replace: true });
      return;
    }
  }, [user, token]);
  useEffect(() => {
    const checkUserServers = async () => {
      try {
        if (user) {
          const response = await getUserServer(user.id);
          console.log(response);
          if (!response.success) {
            throw new Error("Failed to fetch servers");
          }

          const data = response.server;
          setActiveServer(data);
          navigate(`/servers/${data.id}`, { replace: true });
          console.log("navigating");
        }
      } catch (error) {
        console.error("Error checking servers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    console.log("calling checkUserServers");
    checkUserServers();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <CreateServerForm dialogTriggerButton={true} />
    </div>
  );
};

export default CreateServerPage;
