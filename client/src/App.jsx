import axios from "axios";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useAlert } from "./components/AlertContext";
import { AlertCustomStyles } from "./components/AlertCustomStyles";

import Sidebar from "./components/Sidebar";

import LoginPage from "./pages/LoginPage";
import UserActivityPage from "./pages/UserActivityPage";
import UserPage from "./pages/UserPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { showAlert } = useAlert();

  const handleShowAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("No access token found. Please log in again.");
        return;
      }

      console.log("Token:", token);

      const response = await axios.post(
        "http://127.0.0.1:5000/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        showAlert("Successfully logged out!", "success");
        window.location.href = "/login";
      } else {
        showAlert("Logout failed", "error");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error.response?.data || error.message);
      showAlert("An error occurred during logout.", "error");
    }
  };
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      {/* BG */}
      <Sidebar />
      <Routes>
        <Route path="/login" element={<LoginPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} handleShowAlert={handleShowAlert} handleLogout={handleLogout} />} />
        <Route path="/user" element={<UserPage isAuthenticated={isAuthenticated} handleShowAlert={handleShowAlert} handleLogout={handleLogout} />} />
        <Route path="/user-log" element={<UserActivityPage isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
      </Routes>
    </div>
  );
}

export default App;
