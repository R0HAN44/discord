import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import AuthLayout from "./pages/AuthLayout";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import ProtectedLayout from "./pages/ProtectedLayout";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import SetupPage from "./pages/SetupPage";
import CreateServerPage from "./pages/CreateServerPage";
import ServerPage from "./pages/main/ServerPage";
import MainLayout from "./pages/main/MainLayout";

function App() {
  return (
    <>
      <Toaster />
      <Router>
        <div>
          <Routes>
            <Route
              path="/login"
              element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthLayout>
                  <SignUp />
                </AuthLayout>
              }
            />
            <Route
              path="/servers/:serverid"
              element={
                <MainLayout>
                  <ServerPage />
                </MainLayout>
              }
            />
            <Route element={<ProtectedLayout />}>
              <Route path="*" element={<CreateServerPage />} />
              <Route path="/" element={<CreateServerPage />} />
              <Route path="/about" element={<About />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
