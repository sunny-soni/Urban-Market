import { NavLink, Routes, Route, Link } from "react-router-dom";
import {
  FaStore,
  FaShoppingBag,
  FaHeart,
  FaUser,
  FaCompass,
  FaMagic,
} from "react-icons/fa";
import Products from "./products/products";
import Orders from "./orders";
import ProductDetails from "./products/productDetails";
import Navbar from "../../components/navbar/navbar";
import Cart from "./cart";
import Wishlist from "./wishlist";
import ChatWidget from "../../components/chat/chatWidget";
import Recommendations from "./recommendations";

export default function HomePage() {
  // Updated Styles to include Dark Mode support
  const navLinkStyles = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
    }`;

  return (
    // bg-[#f8fafc] for light, bg-slate-950 for dark
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar - Added dark:bg-slate-900 and dark:border-slate-800 */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col sticky top-0 h-screen transition-colors duration-300">
        {/* Store Brand */}
        <div className="p-8">
          <Link to="/app" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center rotate-3">
              <FaShoppingBag className="text-white text-lg -rotate-3" />
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
              Urban<span className="text-indigo-600">Market</span>
            </h2>
          </Link>
        </div>

        {/* Store Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <p className="px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Explore
          </p>

          <NavLink to="/app/products" className={navLinkStyles}>
            <FaCompass className="text-lg" />
            <span className="font-semibold">Shop All</span>
          </NavLink>

          <NavLink to="/app/orders" className={navLinkStyles}>
            <FaShoppingBag className="text-lg" />
            <span className="font-semibold">My Orders</span>
          </NavLink>

          <NavLink to="/app/wishlist" className={navLinkStyles}>
            <FaHeart className="text-lg" />
            <span className="font-semibold">Wishlist</span>
          </NavLink>

          <NavLink to="/app/recommendations" className={navLinkStyles}>
            <FaMagic className="text-lg" />
            <span className="font-semibold">Recommendations</span>
          </NavLink>
        </nav>

        {/* Account Quick Link - Added dark mode colors */}
        <div className="p-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FaUser />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                My Account
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Premium Member
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden p-5">
        <div className="z-10">
          <Navbar />
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="products" element={<Products />} />
              <Route path="cart" element={<Cart />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="orders" element={<Orders />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    {/* Welcome Card Dark Mode support */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-800">
                      <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-4">
                        Welcome to the Store 🛍️
                      </h1>
                      <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Check out our latest arrivals and exclusive deals
                        curated just for you.
                      </p>
                      <Link
                        to="products"
                        className="mt-6 inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition"
                      >
                        Start Browsing
                      </Link>
                    </div>
                  </div>
                }
              />
            </Routes>
          </div>
        </div>

        <div>
          <ChatWidget />
        </div>
      </main>
    </div>
  );
}
