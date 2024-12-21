import UserAvatar from "@/components/UserAvatar";
import useAppStore, { useModal } from "@/useAppStore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getUserDetails, getUserServer } from "@/api/apiController";
import CreateServerModal from "@/components/CreateServerModal";

const CreateServerPage = () => {
  const navigate = useNavigate();
  const { user, setUser, setActiveServer } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const { setDialogTriggerButton } = useModal();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    setDialogTriggerButton(true);
    if (!token) {
      navigate("/signup", { replace: true });
      return;
    }
  }, [token]);
  useEffect(() => {
    const checkUserServers = async () => {
      try {
        const userResponse = await getUserDetails();
        setUser(userResponse.user);
        const response = await getUserServer(userResponse?.user?.id);
        if (!response.success) {
          throw new Error("Failed to fetch servers");
        }

        const data = response.server;
        setActiveServer(data);
        navigate(`/servers/${data.id}`, { replace: true });
        console.log("navigating");
      } catch (error) {
        console.error("Error checking servers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    console.log("calling checkUserServers");
    checkUserServers();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <CreateServerModal />
    </div>
  );
};

export default CreateServerPage;
