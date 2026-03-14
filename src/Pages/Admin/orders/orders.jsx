import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminOrders } from "../../../redux/features/orders/adminOrderSlice";
import { FaClipboardList, FaUserShield, FaChevronRight } from "react-icons/fa";
import VirtualTable from "../../../components/table/table";
import UpdateStatusModal from "./updateStatusModal";
import { updateAdminOrders } from "../../../redux/features/orders/adminOrderSlice";
import CustomerDrawer from "./customerDrawer";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.adminOrder);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleStatusUpdate = (orderId, newStatus) => {
    dispatch(updateAdminOrders({ orderId, newStatus }));
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [dispatch]);

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "delivered")
      return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400";
    if (s === "pending")
      return "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400";
    if (s === "cancelled")
      return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
    return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400";
  };

  const Row = ({ index, style, data }) => {
    const row = data[index];
    if (!row) return null;

    return (
      <div
        style={style}
        className="flex items-center border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors px-8"
      >
        <div className="flex-1">
          <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
            #ORD-{row.id}
          </span>
        </div>

        <div className="flex-[2] overflow-hidden pr-4">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate">
            {row.username || "no-username"}
          </p>
        </div>

        <div className="flex-[2] overflow-hidden pr-4">
          <button
            onClick={() => {
              setSelectedCustomer(row);
              setIsDrawerOpen(true);
            }}
            className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
          >
            {row.full_name || "Guest Customer"}
          </button>
        </div>

        <div className="flex-[2] overflow-hidden pr-4">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
            {row.mode_of_payment === "COD" ? "COD" : "Card"}
          </p>
        </div>

        <div className="flex-1">
          <span
            className={` rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusStyle(row.status)}`}
          >
            {row.status}
          </span>
        </div>

        <div className="flex-1 font-black text-slate-900 dark:text-white text-lg tracking-tighter">
          ₹{row.total}
        </div>

        <div className="w-10 flex justify-end">
          <button
            onClick={() => {
              setSelectedOrder(row);
              setIsModalOpen(true);
            }}
            className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-8 space-y-4 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-3xl w-1/3 mb-10" />
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl"
          />
        ))}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 transition-colors duration-300">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-600 rounded-[1.5rem] shadow-xl shadow-blue-200 dark:shadow-none">
            <FaUserShield className="text-2xl text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              Order Management
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
              Fulfillment Control Center
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-8 py-4 rounded-[2rem] shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
            Live Registry
          </p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {orders.length}{" "}
            <span className="text-sm text-slate-400 uppercase">Records</span>
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <div className="flex-1 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Order ID
          </div>
          <div className="flex-[2] text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Username
          </div>
          <div className="flex-[2] text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Customer
          </div>
          <div className="flex-[2] text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Payment Mode
          </div>
          <div className="flex-1 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Status
          </div>
          <div className="flex-1 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Total
          </div>
          <div className="w-10"></div>
        </div>

        <VirtualTable Row={Row} rowCount={orders.length} data={orders} />
        <UpdateStatusModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentOrder={selectedOrder}
          onUpdate={handleStatusUpdate}
        />
        <CustomerDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          customer={selectedCustomer}
        />
      </div>
    </div>
  );
};

export default Orders;
