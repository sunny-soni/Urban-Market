import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../redux/features/orders/orderSlice";
import { FaBoxOpen, FaClipboardList, FaCalendarAlt, FaReceipt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  // Loading Skeleton - Dark Mode Optimized
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-40 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  // Empty State - Dark Mode Optimized
  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-20 p-10 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-800 transition-colors">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaBoxOpen className="text-4xl text-indigo-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No orders found</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Looks like you haven't placed any orders yet.</p>
        <button 
          onClick={() => navigate("/app/products")}
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 dark:shadow-none"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "delivered") return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    if (s === "pending") return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
    if (s === "cancelled") return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    return "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20 transition-colors">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
          <FaClipboardList className="text-2xl text-white" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Order History</h2>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all overflow-hidden">
            
            {/* Order Header */}
            <div className="bg-slate-50/50 dark:bg-slate-800/50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <FaReceipt className="text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order Reference</p>
                  <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200">#{order.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center justify-end gap-1">
                    <FaCalendarAlt /> Date Placed
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Order Body */}
            <div className="p-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Items Summary</p>
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {order.items.map((item, index) => (
                  <div key={index} className="py-3 flex justify-between items-center group-hover:bg-slate-50/30 dark:group-hover:bg-slate-800/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400">
                        {item.quantity}x
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Credit Card **** 4242</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
                    <span className="text-lg mr-0.5 font-bold">₹</span>
                    {Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;