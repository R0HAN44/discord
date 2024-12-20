import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAppStore from "@/useAppStore";

const UserAvatar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { setUser, setServers } = useAppStore();

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUser(null);
    setServers([]);
    navigate("/login");
  };

  return (
    <div>
      {/* Avatar and Logout Dropdown */}
      <Popover>
        <PopoverTrigger>
          <Avatar>
            <AvatarImage src="/path/to/your/image.jpg" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          className="p-2 bg-red-400 w-fit shadow-lg rounded-md"
        >
          <div
            className="cursor-pointer flex items-center"
            onClick={handleLogout}
          >
            <span className="mr-2">Logout</span>
            <LogOut />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserAvatar;
