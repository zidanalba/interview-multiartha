import React, { useState } from "react";
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, title, footer, children }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <motion.div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <div className="fixed inset-0 bg-gray-900/75 transition-opacity" aria-hidden="true"></div>

      <div className="bg-gray-800 rounded-lg shadow-lg w-180 p-5 relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg text-gray-100 font-semibold">{title}</h3>
          <button className="text-red-400 hover:text-gray-500" onClick={onClose}>
            &times;
          </button>
        </div>
        {/* Modal Body */}
        <div className="py-4 w-full max-w-lg">{children}</div>
        {/* Modal Footer */}
        <div className="flex justify-end space-x-2 border-t pt-3">{footer}</div>
      </div>
    </motion.div>
  );
};

export default Modal;
