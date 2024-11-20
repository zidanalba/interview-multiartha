import { LogOut } from "lucide-react";
import React from "react";

const Header = ({ title, isAuthenticated }) => {
  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700">
      <div className="flex justify-between max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
        <button className="text-purple-400 hover:text-purple-300">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
