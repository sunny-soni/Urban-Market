import React, { useEffect } from "react";
import { 
  FaTimes, 
  FaUserAlt, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaBox, 
  FaReceipt 
} from "react-icons/fa";

const CustomerDrawer = ({ isOpen, onClose, customer }) => {
  // Prevent background scrolling when drawer is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!customer) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className={`fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-[120] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] transform transition-transform duration-500 ease-in-out border-l border-slate-100 dark:border-slate-800 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        
        {/* Fixed Header */}
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-start bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
              <FaUserAlt className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {customer.full_name}
              </h3>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                Order Review
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <FaTimes className="text-slate-400" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-8 overflow-y-auto h-[calc(100vh-160px)] scrollbar-hide">
          
          {/* Inner Wrapper with extra padding-bottom to clear the footer button */}
          <div className="space-y-8 pb-32">
            
            {/* 1. Purchased Items Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FaBox className="text-blue-600 dark:text-blue-400 text-[10px]" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Items in Shipment
                </p>
              </div>
              
              <div className="space-y-3">
                {customer.items && customer.items.length > 0 ? (
                  customer.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          QTY: {item.quantity} × ₹{item.price}
                        </span>
                      </div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        ₹{item.quantity * item.price}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-bold text-slate-400 italic px-2">
                    No items found for this record.
                  </p>
                )}
              </div>
            </div>

            {/* 2. Contact & Shipping Information */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Customer Logistics
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {/* Email Box */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <FaEnvelope className="text-slate-400 text-sm" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">System ID / Email</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                      {customer.email || customer.username}
                    </p>
                  </div>
                </div>

                {/* Phone Box */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <FaPhoneAlt className="text-slate-400 text-sm" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Mobile Contact</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {customer.mobile || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Address Box */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <FaMapMarkerAlt className="text-slate-400 mt-1 text-sm" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Delivery Address</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed mt-1">
                      {customer.address || "No address on file."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Financial Summary Card */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Payment Status
              </p>
              <div className="p-6 bg-blue-600 text-white rounded-[2rem] shadow-xl shadow-blue-200 dark:shadow-none">
                 <div className="flex justify-between items-center mb-4">
                   <span className="text-xs font-bold uppercase tracking-widest opacity-80">Method</span>
                   <span className="text-sm font-black uppercase">{customer.mode_of_payment}</span>
                 </div>
                 <div className="flex justify-between items-end">
                   <div>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-80">Total Amount</span>
                      <p className="text-3xl font-black tracking-tighter mt-1">₹{customer.total}</p>
                   </div>
                   <FaReceipt className="text-4xl opacity-20" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer with Button */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-10">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-opacity shadow-lg"
          >
            Close Order Details
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerDrawer;