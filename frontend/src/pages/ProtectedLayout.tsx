import React, { ReactNode, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

interface ProtectedLayoutProps {
  children?: ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = () => {
  const isAuthenticated = false;
  const navigate = useNavigate();
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    console.log(document.cookie, "cookie");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return <Outlet />;
};

export default ProtectedLayout;
