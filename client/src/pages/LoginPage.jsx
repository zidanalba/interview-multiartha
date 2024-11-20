import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import { getRolesFromToken } from "../utils";
import { AlertCustomStyles } from "../components/AlertCustomStyles";

const LoginPage = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      setErrorMessage("");
      const response = await axios.post("http://127.0.0.1:5000/auth/login", { email, password });
      const { data } = response;

      if (data.access_token) {
        setSuccessMessage("Login successful! Redirecting...");
        setErrorMessage("");
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        const roles = getRolesFromToken(data.access_token);
        setIsAuthenticated(true);
        roles.includes("Admin") ? navigate("/user") : navigate("/unauthorized");
      } else {
        setErrorMessage(data.message || "Login failed");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Login failed: Wrong Email or Password.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Login" isAuthenticated={isAuthenticated} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-20">
        <div className="flex justify-center">
          <div className="w-96 backdrop-blur-lg bg-opacity-80 rounded-lg shadow-lg p-5 bg-gray-900 text-white">
            <h2 className="text-2xl font-bold pb-5">Login</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!isAuthenticated) handleLogin();
              }}
            >
              {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>} {/* Success message */}
              {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Your email</label>
                <input
                  type="email"
                  id="email"
                  className={`${isAuthenticated ? "bg-gray-300" : "bg-gray-100"} border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4`}
                  placeholder="andrew@mail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isAuthenticated}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Your password</label>
                <input
                  type="password"
                  id="password"
                  className={`${isAuthenticated ? "bg-gray-300" : "bg-gray-100"} border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4`}
                  placeholder="*********"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isAuthenticated}
                />
              </div>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  className={`text-white ${isAuthenticated ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"} focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 px-5 w-full sm:w-auto`}
                  disabled={loading}
                  onClick={isAuthenticated ? handleLogout : handleLogin}
                >
                  {loading ? "Loading..." : isAuthenticated ? "Log Out" : "Submit"}
                </button>
                {!isAuthenticated && (
                  <div className="flex items-center text-sm">
                    <p>New here?</p>
                    <p className="underline cursor-pointer ml-1">Register</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
