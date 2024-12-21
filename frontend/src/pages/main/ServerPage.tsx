import useAppStore from "@/useAppStore";
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
  }, []);
  return (
    <div>
      ServerPage
      <p>active server : {activeServer?.id}</p>
    </div>
  );
};

export default ServerPage;
