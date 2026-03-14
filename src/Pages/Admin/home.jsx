import { NavLink, Routes, Route, Link } from "react-router-dom";
import { FaBoxOpen, FaClipboardList, FaChartLine, FaUserShield, FaCog } from "react-icons/fa";
import Products from "./products/products";
import Orders from "./orders/orders";
import ProductDetails from "./products/productDetails";
import Navbar from "../../components/navbar/navbar";

export default function AdminPage() {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
        : "text-slate-400 hover:bg-slate-800 dark:hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <aside className="w-64 bg-[#0f172a] dark:bg-slate-900 text-white flex flex-col sticky top-0 h-screen shadow-2xl z-20 border-r border-transparent dark:border-slate-800">
        
        <div className="p-6 mb-4">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg shadow-inner">
              <FaUserShield className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight leading-none text-white">Admin Panel</h2>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Control Center</span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-2">
          <p className="px-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4">Inventory Management</p>
          
          <NavLink to="/admin/products" className={navLinkClass}>
            <FaBoxOpen className="text-lg" />
            <span className="font-medium">All Products</span>
          </NavLink>

          <NavLink to="/admin/orders" className={navLinkClass}>
            <FaClipboardList className="text-lg" />
            <span className="font-medium">Manage Orders</span>
          </NavLink>

          <div className="pt-6">
            <p className="px-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4">Analytics</p>
            <NavLink to="/admin/reports" className={navLinkClass}>
              <FaChartLine className="text-lg" />
              <span className="font-medium">Sales Reports</span>
            </NavLink>
          </div>
        </nav>

        {/* Sidebar Bottom Action */}
        <div className="p-4 mt-auto border-t border-slate-800">
          <button className="flex items-center gap-3 w-full py-3 px-4 text-slate-400 hover:text-white transition-colors rounded-xl">
            <FaCog className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-sm font-medium">System Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden p-5">
        {/* Navbar sits atop the content */}
        <div className="z-10">
          <Navbar />
        </div>
        
        {/* Content Area with Max-Width Constraint */}
        <div className="flex-1 overflow-y-auto p-4 ">
          <div className="max-w-[1400px] mx-auto">
            <Routes>
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="orders" element={<Orders />} />
              
              {/* Fallback / Welcome Screen - Dark Mode optimized colors */}
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center h-[70vh] text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm transition-colors">
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
                      <FaChartLine className="text-4xl text-blue-500 dark:text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">System Ready</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-2 font-medium">
                      Use the sidebar to manage your store's inventory, track orders, and view performance metrics.
                    </p>
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}