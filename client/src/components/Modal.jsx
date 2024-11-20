import React, { useState } from "react";
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <motion.div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <div className="bg-gray-800 rounded-lg shadow-lg w-120 p-5 relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg text-gray-700 font-semibold">Modal Title</h3>
          <button className="text-gray-400 hover:text-gray-800" onClick={onClose}>
            &times;
          </button>
        </div>
        {/* Modal Body */}
        <div className="py-4">
          <p className="text-sm text-gray-600">This is a simple modal using Tailwind CSS and React state.</p>
        </div>
        {/* Modal Footer */}
        <div className="flex justify-end space-x-2 border-t pt-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Confirm</button>
        </div>
      </div>
    </motion.div>
  );
};

export default Modal;
