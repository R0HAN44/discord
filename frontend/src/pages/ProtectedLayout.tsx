import React, { ReactNode, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

interface ProtectedLayoutProps {
  children?: ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const data = localStorage.getItem("authToken");
    if (data) {
      try {
        const tokenData = JSON.parse(data);
        if (!tokenData) {
          navigate("/login");
          return;
        }
      } catch (error) {
        console.error("Error parsing token data:", error);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <Outlet />;
};

export default ProtectedLayout;
