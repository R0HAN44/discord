import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import AuthLayout from "./pages/AuthLayout";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import ProtectedLayout from "./pages/ProtectedLayout";
import NotFound from "./pages/NotFound";

function App() {
  return (
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
          <Route element={<ProtectedLayout />}>
            <Route path="*" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
