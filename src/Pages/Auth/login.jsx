import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/features/auth/authSlice";
import { FaShoppingBag, FaUser, FaLock } from "react-icons/fa";

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, role, loading } = useSelector((state) => state.auth);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data)).then((res) => {
      if (res.payload?.success) {
        localStorage.setItem("token", res.payload.token);
        localStorage.setItem("userId", res.payload.userId);
        localStorage.setItem("role", res.payload.userId == "1" ? "admin" : "user");
      }
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      role !== "admin" ? navigate("/app/products") : navigate("/admin/products");
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl rotate-3 shadow-lg shadow-indigo-200 dark:shadow-none mb-4">
            <FaShoppingBag className="text-white text-3xl -rotate-3" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Urban<span className="text-indigo-600">Market</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Welcome back! Please login to your account.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register("username")}
                  placeholder="Enter your username"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all outline-none bg-white dark:bg-slate-800 dark:text-white ${
                    errors.username 
                      ? "border-red-400 ring-4 ring-red-50 dark:ring-red-900/20" 
                      : "border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all outline-none bg-white dark:bg-slate-800 dark:text-white ${
                    errors.password 
                      ? "border-red-400 ring-4 ring-red-50 dark:ring-red-900/20" 
                      : "border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
            <span className="relative px-4 bg-white dark:bg-slate-900 text-slate-400 text-xs font-bold uppercase tracking-widest">New here?</span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;