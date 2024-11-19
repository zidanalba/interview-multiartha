import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import LoginPage from "./pages/LoginPage";
import UserActivityPage from "./pages/UserActivityPage";
import UserPage from "./pages/UserPage";

function App() {
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/user-log" element={<UserActivityPage />} />
      </Routes>
    </div>
  );
}

export default App;
