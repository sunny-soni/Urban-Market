import React, { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

const Toast = ({ message, type = "success", isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const styles = {
    success: "bg-indigo-600 dark:bg-indigo-500 text-white shadow-indigo-200 dark:shadow-none",
    error: "bg-red-600 dark:bg-red-500 text-white shadow-red-200 dark:shadow-none",
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100] animate-slide-in-right">
      <div className={`${styles[type]} flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl transition-all`}>
        <div className="text-xl">
          {type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
        </div>
        
        <div className="flex flex-col">
          <p className="text-xs font-black uppercase tracking-widest opacity-80">
            {type === "success" ? "System Success" : "System Error"}
          </p>
          <p className="font-bold text-sm leading-tight">{message}</p>
        </div>

        <button 
          onClick={onClose}
          className="ml-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <FaTimes size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;