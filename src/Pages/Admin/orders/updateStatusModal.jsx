import React from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaShippingFast,
  FaBan,
  FaBoxOpen,
} from "react-icons/fa";

const UpdateStatusModal = ({ isOpen, onClose, currentOrder, onUpdate }) => {
  if (!isOpen || !currentOrder) return null;

  const statuses = [
    {
      id: "pending",
      label: "Pending",
      icon: <FaBoxOpen />,
      color: "text-amber-600 bg-amber-50",
    },
    {
      id: "shipped",
      label: "Shipped",
      icon: <FaShippingFast />,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: <FaCheckCircle />,
      color: "text-green-600 bg-green-50",
    },
    {
      id: "cancelled",
      label: "Cancelled",
      icon: <FaBan />,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all transform scale-100">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Update Order Status
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Order #ORD-{currentOrder.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <FaTimes className="text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">
            Select New Status
          </p>

          <div className="grid grid-cols-1 gap-3">
            {statuses.map((status) => (
              <button
                key={status.id}
                onClick={() => onUpdate(currentOrder.id, status.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${
                  currentOrder.status?.toLowerCase() === status.id
                    ? "border-blue-600 bg-blue-50/30 dark:bg-blue-900/10"
                    : "border-transparent bg-slate-50 dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                }`}
              >
                <div
                  className={`p-3 rounded-xl transition-colors ${status.color}`}
                >
                  {status.icon}
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    {status.label}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Move order to {status.label}
                  </p>
                </div>
                {currentOrder.status?.toLowerCase() === status.id && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Changes will be logged in the system registry
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
