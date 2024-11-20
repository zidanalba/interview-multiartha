import React, { createContext, useContext, useState } from "react";
import { AlertCustomStyles } from "./AlertCustomStyles"; // Adjust the path as needed

// Create a context
const AlertContext = createContext();

// Context provider component
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000); // Auto-hide
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert.show && <AlertCustomStyles message={alert.message} type={alert.type} />}
    </AlertContext.Provider>
  );
};

// Custom hook to use the context
export const useAlert = () => {
  return useContext(AlertContext);
};
