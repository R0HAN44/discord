import {
  checkUserExixtsInServerAndUpdate,
  getUserDetails,
} from "@/api/apiController";
import useAppStore from "@/useAppStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const InviteCode = () => {
  const params = useParams();
  const inviteCode = params.invitecode;
  const navigate = useNavigate();
  const { setUser } = useAppStore();

  useEffect(() => {
    if (!inviteCode) {
      navigate("/");
      return;
    }
    checkExistsInServerAndUpdate();
  }, []);

  const checkExistsInServerAndUpdate = async () => {
    try {
      const userResponse = await getUserDetails();
      setUser(userResponse.user);
      const response = await checkUserExixtsInServerAndUpdate(
        userResponse?.user?.id || "",
        inviteCode || ""
      );
      if (response.serverFound) {
        navigate(`/servers/${response.serverid}`);
      } else {
        navigate(`/`);
      }
    } catch (error: any) {
      if (!error?.response?.data.success) {
        navigate("/");
      }
      console.log(error);
    }
  };

  return <div>invite code</div>;
};

export default InviteCode;
