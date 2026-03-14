import { logout } from "../../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import useDarkMode from "../hooks/useDarkMode";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useDarkMode();
  const role = localStorage.getItem("role");

  const themeLogoutColor =
    role === "admin"
      ? "bg-blue-600 dark:bg-blue-400"
      : "bg-indigo-600 dark:bg-indigo-600";

  const themeHoverLogoutColor =
    role === "admin"
      ? "hover:bg-blue-700 dark:hover:bg-blue-600"
      : "hover:bg-indigo-700 dark:hover:bg-indigo-400";

  return (
    <nav className="h-16 bg-white dark:bg-slate-900 rounded-md shadow-sm border-b border-gray-100 dark:border-slate-800 px-4 mb-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Left Side: Brand/Logo */}
        <div
          className="text-xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
          onClick={() => navigate("/app/products")}
        >
          Urban<span className="text-gray-800 dark:text-slate-200">Market</span>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:ring-2 hover:ring-slate-200 dark:hover:ring-slate-700 transition-all"
            title="Toggle Theme"
          >
            {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>

          {/* Cart Button - Adjusted for Dark Mode */}
          {role !== "admin" && (
            <button
              className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-200 font-medium rounded-xl px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all border border-gray-200 dark:border-slate-700"
              onClick={() => navigate("/app/cart")}
            >
              <FaShoppingCart className="text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Cart</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            className={`flex items-center gap-2 ${themeLogoutColor} text-white font-medium rounded-xl px-4 py-2 ${themeHoverLogoutColor} transition-all shadow-md shadow-blue-100 dark:shadow-none`}
            onClick={() => dispatch(logout())}
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
